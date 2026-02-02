#!/usr/bin/env python3
"""
Demo Test Script for Valentine's Day Experience Generator
Tests the complete flow from creation to viewing
"""

import requests
import json
import time
from urllib.parse import urljoin

BASE_URL = "http://localhost:5001"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data['status']}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_main_page():
    """Test the main generator page loads"""
    print("🏠 Testing main page...")
    try:
        response = requests.get(BASE_URL)
        if response.status_code == 200 and "Valentine's Day Experience Generator" in response.text:
            print("✅ Main page loads successfully")
            return True
        else:
            print(f"❌ Main page failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Main page error: {e}")
        return False

def create_test_experience():
    """Create a test Valentine's experience"""
    print("💕 Creating test experience...")
    
    # Test data
    form_data = {
        'creator_name': 'Alex',
        'recipient_name': 'Jordan',
        'creator_email': 'alex@example.com',
        'personal_message': 'You make every day feel like Valentine\'s Day! Your smile lights up my world and your laugh is my favorite sound. I am so grateful to have you in my life.',
        'memory_text': 'Remember our first date at the coffee shop? You spilled coffee on your shirt and laughed so hard that I knew I was falling for you right then and there.',
        'question_text': 'Will you be my Valentine forever?',
        'color_palette': 'romantic_pink',
        'background_style': 'cloudy',
        'custom_css': '/* Custom romantic styling */ .message-text { text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }'
    }
    
    try:
        response = requests.post(f"{BASE_URL}/create", data=form_data)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print(f"✅ Experience created successfully!")
                print(f"   📋 ID: {data['unique_id']}")
                print(f"   🔗 URL: {data['url']}")
                return data['unique_id'], data['url']
            else:
                print(f"❌ Creation failed: {data.get('error', 'Unknown error')}")
                return None, None
        else:
            print(f"❌ Creation request failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}...")
            return None, None
            
    except Exception as e:
        print(f"❌ Creation error: {e}")
        return None, None

def test_experience_view(unique_id):
    """Test viewing the created experience"""
    print(f"👀 Testing experience view: {unique_id}")
    
    try:
        response = requests.get(f"{BASE_URL}/v/{unique_id}")
        
        if response.status_code == 200:
            content = response.text
            if "Jordan" in content and "Alex" in content:
                print("✅ Experience page loads with correct names")
                return True
            else:
                print("❌ Experience page missing expected content")
                return False
        else:
            print(f"❌ Experience view failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Experience view error: {e}")
        return False

def test_experience_stats(unique_id):
    """Test getting experience statistics"""
    print(f"📊 Testing experience stats: {unique_id}")
    
    try:
        response = requests.get(f"{BASE_URL}/api/stats/{unique_id}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Stats retrieved: {data['view_count']} views")
            return True
        else:
            print(f"❌ Stats request failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Stats error: {e}")
        return False

def test_invalid_experience():
    """Test accessing non-existent experience"""
    print("🚫 Testing invalid experience access...")
    
    try:
        response = requests.get(f"{BASE_URL}/v/invalid-experience-id")
        
        if response.status_code == 404:
            print("✅ Invalid experience correctly returns 404")
            return True
        else:
            print(f"❌ Expected 404, got: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Invalid experience test error: {e}")
        return False

def run_complete_test():
    """Run the complete test suite"""
    print("🚀 Starting Valentine's Day Experience Generator Test Suite")
    print("=" * 60)
    
    tests_passed = 0
    total_tests = 6
    
    # Test 1: Health Check
    if test_health_check():
        tests_passed += 1
    
    print()
    
    # Test 2: Main Page
    if test_main_page():
        tests_passed += 1
    
    print()
    
    # Test 3: Create Experience
    unique_id, experience_url = create_test_experience()
    if unique_id:
        tests_passed += 1
    
    print()
    
    # Test 4: View Experience (only if creation succeeded)
    if unique_id and test_experience_view(unique_id):
        tests_passed += 1
    
    print()
    
    # Test 5: Experience Stats (only if creation succeeded)
    if unique_id and test_experience_stats(unique_id):
        tests_passed += 1
    
    print()
    
    # Test 6: Invalid Experience
    if test_invalid_experience():
        tests_passed += 1
    
    print()
    print("=" * 60)
    print(f"🎯 Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! The Valentine Generator is working perfectly!")
        if unique_id:
            print(f"💝 Demo experience created: {experience_url}")
            print("   You can share this link to test the complete user experience!")
    else:
        print("⚠️  Some tests failed. Please check the application logs.")
    
    return tests_passed == total_tests

if __name__ == "__main__":
    success = run_complete_test()
    exit(0 if success else 1)