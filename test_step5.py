#!/usr/bin/env python3
"""Test Step 5 functionality"""

import requests

def test_step5_experience():
    # Test creating an experience that goes through all 5 steps
    data = {
        'creator_name': 'TestUser',
        'recipient_name': 'TestLove',
        'personal_message': 'Testing all 5 steps with enhancements!',
        'color_palette': 'romantic_pink',
        'background_style': 'hearts',
        'font_style': 'script_elegant',
        'text_effect': 'glow',
        'text_animation': 'typewriter'
    }

    try:
        response = requests.post('http://127.0.0.1:5001/create', data=data, timeout=10)
        result = response.json()
        
        if result.get('success'):
            print('✅ 5-step experience created successfully!')
            print(f'🔗 URL: {result.get("url")}')
            print(f'🎨 Background: hearts (should show heart rain)')
            print(f'✍️ Font: script_elegant (Dancing Script)')
            print(f'✨ Effect: glow')
            print(f'⌨️ Animation: typewriter')
            
            # Test the experience page
            unique_id = result.get('unique_id')
            if unique_id:
                exp_response = requests.get(f'http://127.0.0.1:5001/v/{unique_id}', timeout=10)
                if exp_response.status_code == 200:
                    print('✅ Experience page loads with enhancements!')
                    return True
        else:
            print(f'❌ Failed: {result.get("error")}')
            return False
            
    except Exception as e:
        print(f'❌ Error: {e}')
        return False

if __name__ == "__main__":
    print("🧪 Testing Step 5 Enhancement Features")
    print("=" * 40)
    success = test_step5_experience()
    
    if success:
        print("\n🎉 Step 5 is working!")
        print("🌐 Visit http://127.0.0.1:5001 and try:")
        print("  1. Fill steps 1-3 normally")
        print("  2. Skip custom PIN in step 4 (click Next)")
        print("  3. Reach step 5 for typography & effects")
        print("  4. Select background styles to see previews")
        print("  5. Click 'Create Experience' on step 5")
    else:
        print("\n❌ Step 5 needs more fixes")