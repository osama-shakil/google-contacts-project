// /app/api/add-contact/route.js
import { NextResponse } from 'next/server'
import { getValidAccessToken, hasValidTokens } from '../../../lib/tokenManager.js'

export async function POST(req) {
  const { name, email, phone } = await req.json()

  try {
    // Get valid access token (will refresh if needed and store in database)
    // This ensures only one document exists for userID = 'default_user'
    console.log('Getting valid access token for default_user...')
    const accessToken = await getValidAccessToken('default_user')
    console.log('Access token obtained successfully')

    // First, ensure the "savvy" label exists
    let savvyGroupId = 'savvy'
    try {
      // Try to get the existing "savvy" group
      const groupResponse = await fetch(
        `https://people.googleapis.com/v1/contactGroups/savvy`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      
      if (!groupResponse.ok) {
        // If group doesn't exist, create it
        const createGroupResponse = await fetch(
          'https://people.googleapis.com/v1/contactGroups',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contactGroup: {
                name: 'savvy'
              }
            }),
          }
        )
        
        if (createGroupResponse.ok) {
          const groupData = await createGroupResponse.json()
          savvyGroupId = groupData.resourceName.split('/').pop()
        }
      }
    } catch (error) {
      console.log('Could not create/find savvy group, proceeding without label')
    }

    // Add contact to Google Contacts with "savvy" label
    const contactData = {
      names: [{ givenName: name }],
      emailAddresses: [{ value: email }],
      phoneNumbers: [{ value: phone }]
    }

    // Add label if we have a valid group ID
    if (savvyGroupId && savvyGroupId !== 'savvy') {
      contactData.memberships = [{
        contactGroupMembership: {
          contactGroupResourceName: `contactGroups/${savvyGroupId}`
        }
      }]
    }

    const contactResponse = await fetch(
      'https://people.googleapis.com/v1/people:createContact',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      }
    )

    if (!contactResponse.ok) {
      const contactError = await contactResponse.json()
      return NextResponse.json({ 
        success: false, 
        error: `Failed to create contact: ${contactError.error?.message || contactError.error || 'Unknown error'}` 
      }, { status: contactResponse.status })
    }

    const data = await contactResponse.json()
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('API Error:', err)
    
    // Check if it's an authentication error
    if (err.message.includes('No tokens found')) {
      return NextResponse.json({ 
        success: false, 
        error: 'No authentication found. Please authenticate with Google first.',
        needsAuth: true
      }, { status: 401 })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: `Server error: ${err.message}` 
    }, { status: 500 })
  }
}
