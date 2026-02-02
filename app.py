#!/usr/bin/env python3
"""
Valentine's Day Experience Generator - Production Ready Platform
A professional web application for creating personalized Valentine's Day experiences

@author patchyevole
@github https://github.com/patchyevolve
"""

import os
import sqlite3
import psycopg2
import psycopg2.extras
import secrets
import string
import logging
import mimetypes
from datetime import datetime, timedelta
from pathlib import Path
from flask import Flask, render_template, request, jsonify, redirect, url_for, send_from_directory, abort
from werkzeug.exceptions import RequestEntityTooLarge
from werkzeug.utils import secure_filename
import traceback
import hashlib
import json
from urllib.parse import urlparse

# Configure comprehensive logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('valentine_generator.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Initialize Flask app with production configuration
app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.environ.get('SECRET_KEY', secrets.token_hex(32)),
    MAX_CONTENT_LENGTH=100 * 1024 * 1024,  # 100MB max file size
    TEMPLATES_AUTO_RELOAD=False,  # Production setting
    SEND_FILE_MAX_AGE_DEFAULT=31536000,  # 1 year cache for static files
    DATABASE_URL=os.environ.get('DATABASE_URL', 'valentine_experiences.db'),
    UPLOAD_FOLDER='uploads',
    ALLOWED_EXTENSIONS={'mp4', 'mov', 'avi', 'mkv', 'webm'},
    MAX_EXPERIENCES_PER_IP=100,  # Increased for testing
    EXPERIENCE_EXPIRY_DAYS=365  # Experiences expire after 1 year
)

# Ensure required directories exist
REQUIRED_DIRS = [
    'static', 'static/css', 'static/js', 'static/images', 
    'templates', 'uploads', 'experiences'
]
for directory in REQUIRED_DIRS:
    Path(directory).mkdir(parents=True, exist_ok=True)
    logger.info(f"Ensured directory exists: {directory}")

# Database setup and management
class DatabaseManager:
    """Handles all database operations with proper error handling for both SQLite and PostgreSQL"""
    
    def __init__(self, db_url):
        self.db_url = db_url
        self.is_postgres = db_url.startswith('postgresql://') or db_url.startswith('postgres://')
        self.init_database()
    
    def get_connection(self):
        """Get database connection based on database type"""
        if self.is_postgres:
            return psycopg2.connect(self.db_url)
        else:
            return sqlite3.connect(self.db_url)
    
    def init_database(self):
        """Initialize database with required tables"""
        try:
            with self.get_connection() as conn:
                if self.is_postgres:
                    conn.autocommit = True
                    cursor = conn.cursor()
                    
                    # Create main table for PostgreSQL
                    cursor.execute('''
                        CREATE TABLE IF NOT EXISTS valentine_experiences (
                            id SERIAL PRIMARY KEY,
                            unique_id TEXT UNIQUE NOT NULL,
                            creator_name TEXT NOT NULL,
                            recipient_name TEXT NOT NULL,
                            creator_email TEXT,
                            personal_message TEXT NOT NULL,
                            memory_text TEXT,
                            question_text TEXT,
                            color_palette TEXT NOT NULL,
                            background_style TEXT NOT NULL,
                            video_filename TEXT,
                            music_filename TEXT,
                            custom_css TEXT,
                            access_pin TEXT,
                            creator_ip TEXT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            expires_at TIMESTAMP,
                            view_count INTEGER DEFAULT 0,
                            is_active BOOLEAN DEFAULT TRUE,
                            metadata TEXT,
                            font_style TEXT DEFAULT 'sans_modern',
                            text_effect TEXT DEFAULT 'none',
                            text_animation TEXT DEFAULT 'fade_in',
                            particle_system TEXT DEFAULT 'none',
                            svg_animation TEXT DEFAULT 'none'
                        )
                    ''')
                    
                    cursor.execute('''
                        CREATE TABLE IF NOT EXISTS experience_views (
                            id SERIAL PRIMARY KEY,
                            experience_id TEXT NOT NULL,
                            viewer_ip TEXT,
                            viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            user_agent TEXT,
                            FOREIGN KEY (experience_id) REFERENCES valentine_experiences (unique_id)
                        )
                    ''')
                    
                    # Create indexes for PostgreSQL
                    cursor.execute('CREATE INDEX IF NOT EXISTS idx_unique_id ON valentine_experiences(unique_id)')
                    cursor.execute('CREATE INDEX IF NOT EXISTS idx_expires_at ON valentine_experiences(expires_at)')
                    cursor.execute('CREATE INDEX IF NOT EXISTS idx_creator_ip ON valentine_experiences(creator_ip)')
                    
                else:
                    # SQLite version
                    conn.execute('''
                        CREATE TABLE IF NOT EXISTS valentine_experiences (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            unique_id TEXT UNIQUE NOT NULL,
                            creator_name TEXT NOT NULL,
                            recipient_name TEXT NOT NULL,
                            creator_email TEXT,
                            personal_message TEXT NOT NULL,
                            memory_text TEXT,
                            question_text TEXT,
                            color_palette TEXT NOT NULL,
                            background_style TEXT NOT NULL,
                            video_filename TEXT,
                            music_filename TEXT,
                            custom_css TEXT,
                            creator_ip TEXT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            expires_at TIMESTAMP,
                            view_count INTEGER DEFAULT 0,
                            is_active BOOLEAN DEFAULT 1,
                            metadata TEXT,
                            access_pin TEXT,
                            font_style TEXT DEFAULT 'sans_modern',
                            text_effect TEXT DEFAULT 'none',
                            text_animation TEXT DEFAULT 'fade_in',
                            particle_system TEXT DEFAULT 'none',
                            svg_animation TEXT DEFAULT 'none'
                        )
                    ''')
                    
                    # Check if access_pin column exists, if not add it
                    cursor = conn.execute("PRAGMA table_info(valentine_experiences)")
                    columns = [column[1] for column in cursor.fetchall()]
                    
                    if 'access_pin' not in columns:
                        logger.info("Adding access_pin column to existing database")
                        conn.execute('ALTER TABLE valentine_experiences ADD COLUMN access_pin TEXT')
                        
                        # Update existing records with random PINs
                        conn.execute('''
                            UPDATE valentine_experiences 
                            SET access_pin = printf('%04d', abs(random()) % 10000)
                            WHERE access_pin IS NULL
                        ''')
                        logger.info("Updated existing experiences with random PINs")
                    
                    # Add new enhancement columns if they don't exist
                    enhancement_columns = [
                        ('font_style', 'TEXT DEFAULT "sans_modern"'),
                        ('text_effect', 'TEXT DEFAULT "none"'),
                        ('text_animation', 'TEXT DEFAULT "fade_in"'),
                        ('particle_system', 'TEXT DEFAULT "none"'),
                        ('svg_animation', 'TEXT DEFAULT "none"')
                    ]
                    
                    for col_name, col_definition in enhancement_columns:
                        if col_name not in columns:
                            logger.info(f"Adding {col_name} column to existing database")
                            conn.execute(f'ALTER TABLE valentine_experiences ADD COLUMN {col_name} {col_definition}')
                            logger.info(f"Added {col_name} column successfully")
                    
                    conn.execute('''
                        CREATE TABLE IF NOT EXISTS experience_views (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            experience_id TEXT NOT NULL,
                            viewer_ip TEXT,
                            viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            user_agent TEXT,
                            FOREIGN KEY (experience_id) REFERENCES valentine_experiences (unique_id)
                        )
                    ''')
                    
                    # Create indexes for SQLite
                    conn.execute('CREATE INDEX IF NOT EXISTS idx_unique_id ON valentine_experiences(unique_id)')
                    conn.execute('CREATE INDEX IF NOT EXISTS idx_expires_at ON valentine_experiences(expires_at)')
                    conn.execute('CREATE INDEX IF NOT EXISTS idx_creator_ip ON valentine_experiences(creator_ip)')
                
                logger.info("Database initialized successfully")
                
        except Exception as e:
            logger.error(f"Database initialization failed: {e}")
            raise
    
    def create_experience(self, experience_data):
        """Create a new Valentine's experience"""
        try:
            unique_id = self.generate_unique_id()
            
            # Use custom PIN if provided, otherwise generate one
            if experience_data.get('custom_pin'):
                access_pin = experience_data.get('custom_pin')
                logger.info(f"Using custom PIN: {access_pin}")
            else:
                access_pin = self.generate_access_pin()
                logger.info(f"Generated random PIN: {access_pin}")
            
            expires_at = datetime.now() + timedelta(days=app.config['EXPERIENCE_EXPIRY_DAYS'])
            
            logger.info(f"Creating experience with ID: {unique_id}, PIN: {access_pin}")
            
            with self.get_connection() as conn:
                if self.is_postgres:
                    cursor = conn.cursor()
                    cursor.execute('''
                        INSERT INTO valentine_experiences (
                            unique_id, creator_name, recipient_name, creator_email,
                            personal_message, memory_text, question_text,
                            color_palette, background_style, video_filename,
                            music_filename, custom_css, access_pin, creator_ip, expires_at, metadata,
                            font_style, text_effect, text_animation, particle_system, svg_animation
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ''', (
                        unique_id,
                        experience_data.get('creator_name'),
                        experience_data.get('recipient_name'),
                        experience_data.get('creator_email'),
                        experience_data.get('personal_message'),
                        experience_data.get('memory_text'),
                        experience_data.get('question_text'),
                        experience_data.get('color_palette'),
                        experience_data.get('background_style'),
                        experience_data.get('video_filename'),
                        experience_data.get('music_filename'),
                        experience_data.get('custom_css'),
                        access_pin,
                        experience_data.get('creator_ip'),
                        expires_at,
                        json.dumps(experience_data.get('metadata', {})),
                        experience_data.get('font_style', 'sans_modern'),
                        experience_data.get('text_effect', 'none'),
                        experience_data.get('text_animation', 'fade_in'),
                        experience_data.get('particle_system', 'none'),
                        experience_data.get('svg_animation', 'none')
                    ))
                    conn.commit()
                else:
                    conn.execute('''
                        INSERT INTO valentine_experiences (
                            unique_id, creator_name, recipient_name, creator_email,
                            personal_message, memory_text, question_text,
                            color_palette, background_style, video_filename,
                            music_filename, custom_css, access_pin, creator_ip, expires_at, metadata,
                            font_style, text_effect, text_animation, particle_system, svg_animation
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        unique_id,
                        experience_data.get('creator_name'),
                        experience_data.get('recipient_name'),
                        experience_data.get('creator_email'),
                        experience_data.get('personal_message'),
                        experience_data.get('memory_text'),
                        experience_data.get('question_text'),
                        experience_data.get('color_palette'),
                        experience_data.get('background_style'),
                        experience_data.get('video_filename'),
                        experience_data.get('music_filename'),
                        experience_data.get('custom_css'),
                        access_pin,
                        experience_data.get('creator_ip'),
                        expires_at,
                        json.dumps(experience_data.get('metadata', {})),
                        experience_data.get('font_style', 'sans_modern'),
                        experience_data.get('text_effect', 'none'),
                        experience_data.get('text_animation', 'fade_in'),
                        experience_data.get('particle_system', 'none'),
                        experience_data.get('svg_animation', 'none')
                    ))
                    conn.commit()
                
            logger.info(f"Successfully created experience: {unique_id} with PIN: {access_pin}")
            return unique_id, access_pin
            
        except Exception as e:
            logger.error(f"Failed to create experience: {e}")
            logger.error(f"Exception details: {traceback.format_exc()}")
            raise
    
    def get_experience(self, unique_id):
        """Retrieve an experience by unique ID"""
        try:
            with self.get_connection() as conn:
                if self.is_postgres:
                    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                    cursor.execute('''
                        SELECT * FROM valentine_experiences 
                        WHERE unique_id = %s AND is_active = TRUE AND expires_at > NOW()
                    ''', (unique_id,))
                    experience = cursor.fetchone()
                else:
                    conn.row_factory = sqlite3.Row
                    cursor = conn.execute('''
                        SELECT * FROM valentine_experiences 
                        WHERE unique_id = ? AND is_active = 1 AND expires_at > datetime('now')
                    ''', (unique_id,))
                    experience = cursor.fetchone()
                
                if experience:
                    # Convert to dict and parse metadata
                    exp_dict = dict(experience)
                    if exp_dict['metadata']:
                        exp_dict['metadata'] = json.loads(exp_dict['metadata'])
                    return exp_dict
                return None
                
        except Exception as e:
            logger.error(f"Failed to get experience {unique_id}: {e}")
            return None
    
    def increment_view_count(self, unique_id, viewer_ip, user_agent):
        """Increment view count and log the view"""
        try:
            with self.get_connection() as conn:
                if self.is_postgres:
                    cursor = conn.cursor()
                    # Update view count
                    cursor.execute('''
                        UPDATE valentine_experiences 
                        SET view_count = view_count + 1 
                        WHERE unique_id = %s
                    ''', (unique_id,))
                    
                    # Log the view
                    cursor.execute('''
                        INSERT INTO experience_views (experience_id, viewer_ip, user_agent)
                        VALUES (%s, %s, %s)
                    ''', (unique_id, viewer_ip, user_agent))
                    conn.commit()
                else:
                    # Update view count
                    conn.execute('''
                        UPDATE valentine_experiences 
                        SET view_count = view_count + 1 
                        WHERE unique_id = ?
                    ''', (unique_id,))
                    
                    # Log the view
                    conn.execute('''
                        INSERT INTO experience_views (experience_id, viewer_ip, user_agent)
                        VALUES (?, ?, ?)
                    ''', (unique_id, viewer_ip, user_agent))
                    
                    conn.commit()
                
        except Exception as e:
            logger.error(f"Failed to increment view count for {unique_id}: {e}")
    
    def get_creator_experience_count(self, creator_ip):
        """Get number of experiences created by an IP"""
        try:
            with self.get_connection() as conn:
                if self.is_postgres:
                    cursor = conn.cursor()
                    cursor.execute('''
                        SELECT COUNT(*) FROM valentine_experiences 
                        WHERE creator_ip = %s AND created_at > NOW() - INTERVAL '1 day'
                    ''', (creator_ip,))
                    return cursor.fetchone()[0]
                else:
                    cursor = conn.execute('''
                        SELECT COUNT(*) FROM valentine_experiences 
                        WHERE creator_ip = ? AND created_at > datetime('now', '-1 day')
                    ''', (creator_ip,))
                    return cursor.fetchone()[0]
        except Exception as e:
            logger.error(f"Failed to get creator count: {e}")
            return 0
    
    def generate_access_pin(self):
        """Generate a 4-digit access PIN"""
        return f"{secrets.randbelow(10000):04d}"
    
    def generate_unique_id(self):
        """Generate a unique, URL-safe ID"""
        while True:
            # Generate a readable ID with words and numbers
            adjectives = ['sweet', 'lovely', 'romantic', 'beautiful', 'magical', 'dreamy', 'tender', 'precious']
            nouns = ['heart', 'love', 'kiss', 'hug', 'smile', 'moment', 'memory', 'feeling']
            
            adjective = secrets.choice(adjectives)
            noun = secrets.choice(nouns)
            number = secrets.randbelow(9999)
            
            unique_id = f"{adjective}-{noun}-{number:04d}"
            
            # Check if ID already exists
            try:
                with self.get_connection() as conn:
                    if self.is_postgres:
                        cursor = conn.cursor()
                        cursor.execute('SELECT id FROM valentine_experiences WHERE unique_id = %s', (unique_id,))
                        if not cursor.fetchone():
                            return unique_id
                    else:
                        cursor = conn.execute('SELECT id FROM valentine_experiences WHERE unique_id = ?', (unique_id,))
                        if not cursor.fetchone():
                            return unique_id
            except Exception:
                continue

# Initialize database manager
db_manager = DatabaseManager(app.config['DATABASE_URL'])

# Color palettes and themes
COLOR_PALETTES = {
    'romantic_pink': {
        'name': 'Romantic Pink',
        'primary': '#ff6b9d',
        'secondary': '#fd79a8',
        'accent': '#fdcb6e',
        'background': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        'description': 'Classic romantic pink with warm tones'
    },
    'sunset_orange': {
        'name': 'Sunset Orange',
        'primary': '#ff7675',
        'secondary': '#fd79a8',
        'accent': '#fdcb6e',
        'background': 'linear-gradient(135deg, #ff9a56 0%, #ff6b9d 50%, #c44569 100%)',
        'description': 'Warm sunset colors with orange and pink'
    },
    'purple_dream': {
        'name': 'Purple Dream',
        'primary': '#a29bfe',
        'secondary': '#6c5ce7',
        'accent': '#fd79a8',
        'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #a29bfe 100%)',
        'description': 'Dreamy purple with mystical vibes'
    },
    'ocean_blue': {
        'name': 'Ocean Blue',
        'primary': '#74b9ff',
        'secondary': '#0984e3',
        'accent': '#00cec9',
        'background': 'linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #00cec9 100%)',
        'description': 'Calming ocean blues and teals'
    },
    'forest_green': {
        'name': 'Forest Green',
        'primary': '#00b894',
        'secondary': '#00a085',
        'accent': '#55a3ff',
        'background': 'linear-gradient(135deg, #00b894 0%, #55a3ff 50%, #667eea 100%)',
        'description': 'Natural forest greens with sky blue'
    },
    'golden_hour': {
        'name': 'Golden Hour',
        'primary': '#fdcb6e',
        'secondary': '#f39c12',
        'accent': '#ff7675',
        'background': 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 50%, #ff7675 100%)',
        'description': 'Warm golden tones like sunset'
    },
    
    # NEW ENHANCED GRADIENTS
    'neon_cyberpunk': {
        'name': 'Neon Cyberpunk',
        'primary': '#ff0080',
        'secondary': '#00ffff',
        'accent': '#ff4081',
        'background': 'linear-gradient(135deg, #ff0080 0%, #7928ca 30%, #00ffff 70%, #ff4081 100%)',
        'description': 'Electric neon colors with cyberpunk vibes'
    },
    'pastel_rainbow': {
        'name': 'Pastel Rainbow',
        'primary': '#ffeaa7',
        'secondary': '#fab1a0',
        'accent': '#fd79a8',
        'background': 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 25%, #fd79a8 50%, #a29bfe 75%, #74b9ff 100%)',
        'description': 'Soft pastel rainbow with dreamy colors'
    },
    'dark_gothic': {
        'name': 'Dark Gothic',
        'primary': '#2d3436',
        'secondary': '#636e72',
        'accent': '#e17055',
        'background': 'linear-gradient(135deg, #2d3436 0%, #636e72 50%, #e17055 100%)',
        'description': 'Dark romantic with gothic elegance'
    },
    'metallic_gold': {
        'name': 'Metallic Gold',
        'primary': '#f39c12',
        'secondary': '#d35400',
        'accent': '#fdcb6e',
        'background': 'linear-gradient(135deg, #f39c12 0%, #d35400 30%, #fdcb6e 70%, #f1c40f 100%)',
        'description': 'Luxurious metallic gold with bronze'
    },
    'rose_gold': {
        'name': 'Rose Gold',
        'primary': '#e84393',
        'secondary': '#fd79a8',
        'accent': '#fdcb6e',
        'background': 'linear-gradient(135deg, #e84393 0%, #fd79a8 40%, #fdcb6e 80%, #f39c12 100%)',
        'description': 'Elegant rose gold with warm tones'
    },
    'cherry_blossom': {
        'name': 'Cherry Blossom',
        'primary': '#fd79a8',
        'secondary': '#fdcb6e',
        'accent': '#fab1a0',
        'background': 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 30%, #fab1a0 70%, #ffeaa7 100%)',
        'description': 'Soft cherry blossom pink and cream'
    },
    'midnight_aurora': {
        'name': 'Midnight Aurora',
        'primary': '#00b894',
        'secondary': '#00cec9',
        'accent': '#a29bfe',
        'background': 'linear-gradient(135deg, #2d3436 0%, #00b894 30%, #00cec9 60%, #a29bfe 100%)',
        'description': 'Northern lights over midnight sky'
    }
}

BACKGROUND_STYLES = {
    'cloudy': {
        'name': 'Soft Clouds',
        'description': 'Gentle floating clouds with soft edges'
    },
    'particles': {
        'name': 'Floating Particles',
        'description': 'Magical floating particles and sparkles'
    },
    'geometric': {
        'name': 'Geometric Patterns',
        'description': 'Modern geometric shapes and patterns'
    },
    'minimal': {
        'name': 'Minimal Clean',
        'description': 'Clean and minimal background'
    },
    
    # NEW ENHANCED BACKGROUNDS
    'hearts': {
        'name': 'Heart Rain',
        'description': 'Falling animated hearts'
    },
    'stars': {
        'name': 'Starfield',
        'description': 'Twinkling stars with depth'
    },
    'petals': {
        'name': 'Rose Petals',
        'description': 'Floating rose petals'
    },
    'fireflies': {
        'name': 'Fireflies',
        'description': 'Glowing dots with trails'
    },
    'bubbles': {
        'name': 'Bubbles',
        'description': 'Floating soap bubbles'
    },
    'svg_hearts': {
        'name': 'Animated Hearts',
        'description': 'Pulsing heart shapes with smooth animations'
    },
    'svg_waves': {
        'name': 'Geometric Waves',
        'description': 'Flowing wave patterns with gradient colors'
    },
    'svg_shapes': {
        'name': 'Floating Shapes',
        'description': 'Geometric shapes floating with depth'
    },
    'svg_nature': {
        'name': 'Nature Elements',
        'description': 'Animated leaves, flowers, and butterflies'
    }
}

# Font styles for typography
FONT_STYLES = {
    'script_elegant': {
        'name': 'Elegant Script',
        'family': '"Dancing Script", "Brush Script MT", cursive',
        'category': 'script',
        'description': 'Flowing script font perfect for romantic messages'
    },
    'script_romantic': {
        'name': 'Romantic Script',
        'family': '"Great Vibes", "Lucida Handwriting", cursive',
        'category': 'script',
        'description': 'Romantic handwritten style'
    },
    'serif_classic': {
        'name': 'Classic Serif',
        'family': '"Playfair Display", "Times New Roman", serif',
        'category': 'serif',
        'description': 'Elegant classical serif'
    },
    'serif_romantic': {
        'name': 'Romantic Serif',
        'family': '"Crimson Text", "Georgia", serif',
        'category': 'serif',
        'description': 'Romantic book-style serif'
    },
    'sans_modern': {
        'name': 'Modern Sans',
        'family': '"Poppins", "Helvetica Neue", sans-serif',
        'category': 'sans',
        'description': 'Clean modern sans-serif'
    },
    'sans_elegant': {
        'name': 'Elegant Sans',
        'family': '"Montserrat", "Arial", sans-serif',
        'category': 'sans',
        'description': 'Sophisticated sans-serif'
    }
}

def allowed_file(filename):
    """Check if uploaded file is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def get_client_ip():
    """Get client IP address"""
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    elif request.headers.get('X-Real-IP'):
        return request.headers.get('X-Real-IP')
    else:
        return request.remote_addr

def validate_custom_pin(pin):
    """Validate custom PIN format"""
    if not pin:
        return False
    
    # Must be 4 digits only
    if not pin.isdigit():
        return False
    
    if len(pin) != 4:
        return False
    
    # Avoid obviously weak PINs
    weak_pins = ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', 
                 '1234', '4321', '0123', '9876', '1122', '2211']
    if pin in weak_pins:
        return False
    
    return True

@app.errorhandler(404)
def not_found_error(error):
    """Handle 404 errors gracefully"""
    logger.warning(f"404 error: {request.url}")
    return render_template('error.html', 
                         error_code=404,
                         error_message="Page not found, but love is everywhere! 💕"), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors with romantic fallback"""
    logger.error(f"500 error: {error}")
    return render_template('error.html',
                         error_code=500, 
                         error_message="Something went wrong, but our love is unbreakable! ❤️"), 500

@app.errorhandler(RequestEntityTooLarge)
def too_large(error):
    """Handle file too large errors"""
    logger.warning("File too large uploaded")
    return jsonify({'error': 'File too large! Please upload a smaller video (max 100MB)'}), 413

@app.route('/')
def index():
    """Main landing page - Valentine's Day Experience Generator"""
    try:
        return render_template('index.html', 
                             color_palettes=COLOR_PALETTES,
                             background_styles=BACKGROUND_STYLES,
                             font_styles=FONT_STYLES)
    except Exception as e:
        logger.error(f"Error in main route: {e}")
        return f"Error loading page: {str(e)}", 500

@app.route('/create', methods=['POST'])
def create_experience():
    """Create a new Valentine's Day experience"""
    try:
        # Rate limiting check
        client_ip = get_client_ip()
        if db_manager.get_creator_experience_count(client_ip) >= app.config['MAX_EXPERIENCES_PER_IP']:
            return jsonify({
                'success': False,
                'error': 'Rate limit exceeded. Please try again tomorrow.'
            }), 429
        
        # Validate required fields
        required_fields = ['creator_name', 'recipient_name', 'personal_message', 'color_palette']
        for field in required_fields:
            if not request.form.get(field):
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Handle file uploads
        video_filename = None
        music_filename = None
        
        if 'video_file' in request.files:
            video_file = request.files['video_file']
            if video_file and video_file.filename and allowed_file(video_file.filename):
                filename = secure_filename(video_file.filename)
                unique_filename = f"{secrets.token_hex(8)}_{filename}"
                video_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                video_file.save(video_path)
                video_filename = unique_filename
                logger.info(f"Video uploaded: {unique_filename}")
        
        # Handle custom PIN
        custom_pin = request.form.get('custom_pin', '').strip()
        if custom_pin and validate_custom_pin(custom_pin):
            access_pin = custom_pin
            logger.info(f"Using custom PIN: {access_pin}")
        else:
            access_pin = None  # Will be generated automatically
            if custom_pin:
                logger.warning(f"Invalid custom PIN provided: {custom_pin}, using auto-generated PIN")
        
        # Prepare experience data
        experience_data = {
            'creator_name': request.form.get('creator_name').strip(),
            'recipient_name': request.form.get('recipient_name').strip(),
            'creator_email': request.form.get('creator_email', '').strip(),
            'personal_message': request.form.get('personal_message').strip(),
            'memory_text': request.form.get('memory_text', '').strip(),
            'question_text': request.form.get('question_text', f"Will you be my Valentine, {request.form.get('recipient_name')}?").strip(),
            'color_palette': request.form.get('color_palette'),
            'background_style': request.form.get('background_style', 'cloudy'),
            'video_filename': video_filename,
            'music_filename': music_filename,
            'custom_css': request.form.get('custom_css', '').strip(),
            'custom_pin': access_pin,  # Pass the custom PIN to the database manager
            'creator_ip': client_ip,
            # NEW ENHANCEMENT FIELDS
            'font_style': request.form.get('font_style', 'sans_modern'),
            'text_effect': request.form.get('text_effect', 'none'),
            'text_animation': request.form.get('text_animation', 'fade_in'),
            'particle_system': request.form.get('particle_system', 'none'),
            'svg_animation': request.form.get('svg_animation', 'none'),
            'metadata': {
                'user_agent': request.headers.get('User-Agent', ''),
                'created_from': 'web_form',
                'version': '1.0'
            }
        }
        
        # Create the experience
        unique_id, access_pin = db_manager.create_experience(experience_data)
        
        # Generate the shareable URL
        experience_url = url_for('view_experience', unique_id=unique_id, _external=True)
        
        logger.info(f"Created experience {unique_id} for {experience_data['creator_name']} with PIN {access_pin}")
        
        return jsonify({
            'success': True,
            'unique_id': unique_id,
            'access_pin': access_pin,
            'url': experience_url,
            'message': 'Your Valentine\'s Day experience has been created successfully!'
        })
        
    except Exception as e:
        logger.error(f"Failed to create experience: {e}")
        logger.error(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': 'Failed to create experience. Please try again.'
        }), 500

@app.route('/v/<unique_id>')
def view_experience(unique_id):
    """View a specific Valentine's Day experience - requires PIN"""
    try:
        # Get the experience
        experience = db_manager.get_experience(unique_id)
        if not experience:
            logger.warning(f"Experience not found: {unique_id}")
            return render_template('error.html',
                                 error_code=404,
                                 error_message="This Valentine's experience doesn't exist or has expired 💔"), 404
        
        # Check if PIN is provided
        provided_pin = request.args.get('pin')
        if not provided_pin:
            # Show PIN entry page
            return render_template('pin_entry.html', unique_id=unique_id)
        
        # Verify PIN
        if provided_pin != experience['access_pin']:
            logger.warning(f"Invalid PIN attempt for experience {unique_id}: {provided_pin}")
            return render_template('pin_entry.html', 
                                 unique_id=unique_id, 
                                 error="Invalid PIN. Please try again.")
        
        # PIN is correct, show the experience
        # Increment view count
        client_ip = get_client_ip()
        user_agent = request.headers.get('User-Agent', '')
        db_manager.increment_view_count(unique_id, client_ip, user_agent)
        
        # Get color palette
        color_palette = COLOR_PALETTES.get(experience['color_palette'], COLOR_PALETTES['romantic_pink'])
        
        logger.info(f"Serving experience {unique_id} with valid PIN (views: {experience['view_count'] + 1})")
        
        return render_template('experience.html',
                             experience=experience,
                             color_palette=color_palette,
                             unique_id=unique_id)
        
    except Exception as e:
        logger.error(f"Error viewing experience {unique_id}: {e}")
        return render_template('error.html',
                             error_code=500,
                             error_message="Error loading this Valentine's experience 💔"), 500

@app.route('/uploads/<filename>')
def serve_upload(filename):
    """Serve uploaded files securely"""
    try:
        # Security check: prevent directory traversal
        if '..' in filename or '/' in filename:
            abort(403)
        
        upload_path = Path(app.config['UPLOAD_FOLDER']) / filename
        if not upload_path.exists():
            abort(404)
        
        # Set proper MIME type
        mimetype = mimetypes.guess_type(filename)[0] or 'application/octet-stream'
        
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, mimetype=mimetype)
        
    except Exception as e:
        logger.error(f"Error serving upload {filename}: {e}")
        abort(500)

@app.route('/api/stats/<unique_id>')
def get_stats(unique_id):
    """Get basic stats for an experience (for creators)"""
    try:
        experience = db_manager.get_experience(unique_id)
        if not experience:
            return jsonify({'error': 'Experience not found'}), 404
        
        return jsonify({
            'view_count': experience['view_count'],
            'created_at': experience['created_at'],
            'recipient_name': experience['recipient_name']
        })
        
    except Exception as e:
        logger.error(f"Error getting stats for {unique_id}: {e}")
        return jsonify({'error': 'Failed to get stats'}), 500

@app.route('/health')
def health_check():
    """Health check endpoint for monitoring"""
    try:
        # Test database connection
        with db_manager.get_connection() as conn:
            if db_manager.is_postgres:
                cursor = conn.cursor()
                cursor.execute('SELECT 1')
                cursor.fetchone()
            else:
                conn.execute('SELECT 1').fetchone()
        
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'version': '1.0.0'
        })
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    try:
        logger.info("Starting Valentine's Day Experience Generator")
        
        # Production-ready server configuration
        port = int(os.environ.get('PORT', 5001))
        debug = os.environ.get('FLASK_ENV') == 'development'
        
        app.run(
            host='0.0.0.0',
            port=port,
            debug=debug,
            threaded=True
        )
        
    except Exception as e:
        logger.error(f"Failed to start application: {e}")
        logger.error(traceback.format_exc())
        exit(1)