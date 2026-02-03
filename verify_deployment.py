#!/usr/bin/env python3
"""
Deployment Verification Script
Quick check to ensure the app is ready for production deployment
"""

import os
import sys

def main():
    print("🚀 Valentine Generator - Deployment Verification")
    print("=" * 50)
    
    # Test 1: Environment Check
    print("1. Checking environment...")
    database_url = os.environ.get('DATABASE_URL', 'valentine_experiences.db')
    print(f"   Database URL: {database_url}")
    
    # Test 2: Import Check
    print("2. Testing imports...")
    try:
        from app import app, db_manager
        print("   ✅ App imports successful")
    except Exception as e:
        print(f"   ❌ Import failed: {e}")
        return False
    
    # Test 3: Database Check
    print("3. Testing database...")
    try:
        with app.app_context():
            # Try a simple database operation
            conn = db_manager.get_connection()
            conn.close()
        print("   ✅ Database connection successful")
    except Exception as e:
        print(f"   ❌ Database failed: {e}")
        return False
    
    # Test 4: Routes Check
    print("4. Testing routes...")
    try:
        with app.test_client() as client:
            response = client.get('/')
            if response.status_code == 200:
                print("   ✅ Main route working")
            else:
                print(f"   ❌ Main route failed: {response.status_code}")
                return False
    except Exception as e:
        print(f"   ❌ Route test failed: {e}")
        return False
    
    print("=" * 50)
    print("🎉 All checks passed! Ready for deployment.")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)