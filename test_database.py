#!/usr/bin/env python3
"""
Quick database test to verify PIN column exists
"""

import sqlite3
import os

def test_database():
    db_path = 'valentine_experiences.db'
    
    if not os.path.exists(db_path):
        print("❌ Database file doesn't exist")
        return
    
    try:
        with sqlite3.connect(db_path) as conn:
            # Check table structure
            cursor = conn.execute("PRAGMA table_info(valentine_experiences)")
            columns = cursor.fetchall()
            
            print("📋 Database columns:")
            for col in columns:
                print(f"  - {col[1]} ({col[2]})")
            
            # Check if access_pin column exists
            column_names = [col[1] for col in columns]
            if 'access_pin' in column_names:
                print("✅ access_pin column exists")
                
                # Check if any records have PINs
                cursor = conn.execute("SELECT COUNT(*) FROM valentine_experiences WHERE access_pin IS NOT NULL")
                count = cursor.fetchone()[0]
                print(f"📊 Records with PINs: {count}")
                
                # Show sample PINs
                cursor = conn.execute("SELECT unique_id, access_pin FROM valentine_experiences WHERE access_pin IS NOT NULL LIMIT 3")
                samples = cursor.fetchall()
                if samples:
                    print("🔐 Sample PINs:")
                    for unique_id, pin in samples:
                        print(f"  - {unique_id}: {pin}")
                
            else:
                print("❌ access_pin column missing")
                
    except Exception as e:
        print(f"❌ Database error: {e}")

if __name__ == "__main__":
    test_database()