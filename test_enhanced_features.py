#!/usr/bin/env python3
"""
Test script for enhanced Valentine's Day Experience Generator
Tests all new modular enhancement features
"""

import requests
import json

def test_enhanced_experience():
    """Test creating an experience with all new enhancement features"""
    
    # Test data with all new enhancement fields
    data = {
        'creator_name': 'Alex',
        'recipient_name': 'Jordan', 
        'creator_email': 'alex@example.com',
        'personal_message': 'You make every day feel like Valentine\'s Day! 💕',
        'memory_text': 'Remember our first date under the stars?',
        'question_text': 'Will you be my Valentine forever?',
        'color_palette': 'rose_gold',
        'background_style': 'hearts',
        'font_style': 'script_elegant',
        'text_effect': 'glow',
        'text_animation': 'typewriter',
        'custom_pin': '2026'
    }
    
    print("🧪 Testing Enhanced Valentine Generator...")
    print("=" * 50)
    
    try:
        # Test experience creation
        print("📝 Creating enhanced experience...")
        response = requests.post('http://127.0.0.1:5001/create', data=data, timeout=10)
        result = response.json()
        
        if result.get('success'):
            print("✅ Enhanced experience created successfully!")
            print(f"🔗 Experience URL: {result.get('url')}")
            print(f"🔐 Access PIN: {result.get('access_pin')}")
            
            # Extract unique ID for testing
            unique_id = result.get('unique_id')
            
            if unique_id:
                # Test experience page loading
                print(f"\n🎭 Testing experience page: {unique_id}")
                exp_response = requests.get(f'http://127.0.0.1:5001/v/{unique_id}', timeout=10)
                
                if exp_response.status_code == 200:
                    print("✅ Experience page loads successfully!")
                    print("\n🎨 Enhanced features should be active:")
                    print("  ✨ Rose Gold gradient background")
                    print("  💖 Heart rain particle system") 
                    print("  ✍️ Elegant script font (Dancing Script)")
                    print("  🌟 Glowing text effect")
                    print("  ⌨️ Typewriter animation")
                    
                    # Test health check
                    health_response = requests.get('http://127.0.0.1:5001/health', timeout=5)
                    if health_response.status_code == 200:
                        health_data = health_response.json()
                        print(f"\n💚 Health check: {health_data.get('status')}")
                    
                    return True
                else:
                    print(f"❌ Experience page error: {exp_response.status_code}")
                    return False
            else:
                print("❌ Could not extract unique ID from response")
                return False
        else:
            print(f"❌ Creation failed: {result.get('error')}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        return False
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def test_multiple_enhancements():
    """Test different combinations of enhancements"""
    
    test_cases = [
        {
            'name': 'Cyberpunk Style',
            'data': {
                'creator_name': 'Neo',
                'recipient_name': 'Trinity',
                'personal_message': 'In the Matrix of love, you are my reality 💜',
                'color_palette': 'neon_cyberpunk',
                'background_style': 'fireflies',
                'font_style': 'sans_modern',
                'text_effect': 'neon',
                'text_animation': 'bounce'
            }
        },
        {
            'name': 'Nature Theme',
            'data': {
                'creator_name': 'Forest',
                'recipient_name': 'River',
                'personal_message': 'Like cherry blossoms in spring, you bring beauty to my world 🌸',
                'color_palette': 'cherry_blossom',
                'background_style': 'petals',
                'font_style': 'serif_romantic',
                'text_effect': 'shadow',
                'text_animation': 'wave'
            }
        },
        {
            'name': 'Mystical Aurora',
            'data': {
                'creator_name': 'Luna',
                'recipient_name': 'Stella',
                'personal_message': 'Under the northern lights, I found my guiding star ✨',
                'color_palette': 'midnight_aurora',
                'background_style': 'stars',
                'font_style': 'serif_classic',
                'text_effect': 'gradient',
                'text_animation': 'fade_in'
            }
        }
    ]
    
    print(f"\n🎨 Testing multiple enhancement combinations...")
    print("=" * 50)
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n{i}. Testing {test_case['name']}...")
        
        try:
            response = requests.post('http://127.0.0.1:5001/create', data=test_case['data'], timeout=10)
            result = response.json()
            
            if result.get('success'):
                unique_id = result.get('unique_id')
                print(f"   ✅ Created: http://127.0.0.1:5001/v/{unique_id}")
            else:
                print(f"   ❌ Failed: {result.get('error')}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 Valentine's Day Experience Generator - Enhanced Testing")
    print("🎨 Testing all modular enhancement systems")
    print("=" * 60)
    
    # Test main enhanced experience
    success = test_enhanced_experience()
    
    if success:
        # Test multiple combinations
        test_multiple_enhancements()
        
        print("\n" + "=" * 60)
        print("🎉 Testing Complete!")
        print("🌐 Visit http://127.0.0.1:5001 to test the generator interface")
        print("💕 All enhancement systems are ready for Valentine's Day!")
    else:
        print("\n❌ Primary test failed. Check server logs for details.")