# 💕 Valentine's Day Experience Generator

A production-ready web application that allows users to create personalized, romantic Valentine's Day experiences with custom messages, themes, videos, and shareable links.

## ✨ Features

### 🎨 **Professional Multi-Step Form**
- **Step 1**: Basic information (names, email)
- **Step 2**: Personal messages and memories
- **Step 3**: Visual design with 6 color palettes and 4 background styles
- **Step 4**: Media upload (videos up to 100MB) and custom CSS

### 💝 **Interactive Valentine Experience**
- Beautiful loading animation with heart beats
- Smooth state transitions with glass morphism effects
- Personal message display with typewriter animation
- Optional memory sharing section
- Interactive decision buttons (Yes/Maybe/Friends)
- Video playback with romantic overlay
- Gentle responses for all choices

### 🔗 **Sharing & Distribution**
- Unique, memorable URLs (e.g., `sweet-heart-1234`)
- One-click sharing via WhatsApp, Email, SMS
- Copy-to-clipboard functionality
- View count tracking
- Experience expiration (1 year)

### 🛡️ **Production Features**
- **Security**: File type validation, size limits, SQL injection protection
- **Performance**: Optimized assets, caching headers, efficient database queries
- **Reliability**: Comprehensive error handling, logging, health checks
- **Scalability**: Rate limiting, database indexing, proper file management

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Flask
- SQLite (included)

### Installation

1. **Clone or navigate to the valentine-generator directory**
   ```bash
   cd valentine-generator
   ```

2. **Install dependencies**
   ```bash
   pip install flask
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open in browser**
   ```
   http://localhost:5001
   ```

## 📁 Project Structure

```
valentine-generator/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── valentine_generator.log # Application logs
├── valentine_experiences.db # SQLite database
├── static/
│   ├── css/
│   │   ├── generator.css     # Form styling
│   │   └── experience.css    # Experience styling
│   ├── js/
│   │   ├── generator.js      # Form functionality
│   │   └── experience.js     # Experience interactions
│   └── images/           # Static images
├── templates/
│   ├── index.html        # Main form page
│   ├── experience.html   # Valentine experience
│   └── error.html        # Error pages
└── uploads/              # User uploaded videos
```

## 🎯 How It Works

### 1. **Creation Flow**
```
User fills form → Server validates → Database stores → Unique URL generated → Share links provided
```

### 2. **Experience Flow**
```
Loading → Welcome → Personal Message → Memory (optional) → Question → Decision → Response
```

### 3. **URL Structure**
- **Generator**: `http://localhost:5001/`
- **Experience**: `http://localhost:5001/v/{unique-id}`
- **Health Check**: `http://localhost:5001/health`

## 🎨 Customization

### Color Palettes
- **Romantic Pink**: Classic pink with warm tones
- **Sunset Orange**: Warm sunset colors
- **Purple Dream**: Mystical purple vibes
- **Ocean Blue**: Calming blues and teals
- **Forest Green**: Natural greens with sky blue
- **Golden Hour**: Warm golden sunset tones

### Background Styles
- **Soft Clouds**: Gentle floating clouds
- **Floating Particles**: Magical sparkles
- **Geometric Patterns**: Modern shapes
- **Minimal Clean**: Clean background

### Advanced Customization
Users can add custom CSS in the form for advanced styling.

## 🔧 Configuration

### Environment Variables
```bash
SECRET_KEY=your-secret-key-here
DATABASE_URL=valentine_experiences.db
PORT=5001
FLASK_ENV=production
```

### Application Settings
```python
MAX_CONTENT_LENGTH = 100MB        # Max file upload size
MAX_EXPERIENCES_PER_IP = 10       # Rate limiting
EXPERIENCE_EXPIRY_DAYS = 365      # Experience lifetime
```

## 📊 Database Schema

### valentine_experiences
- `id`: Primary key
- `unique_id`: Shareable URL identifier
- `creator_name`: Creator's name
- `recipient_name`: Recipient's name
- `personal_message`: Main message
- `memory_text`: Optional memory
- `question_text`: Custom question
- `color_palette`: Selected theme
- `video_filename`: Uploaded video
- `created_at`: Creation timestamp
- `view_count`: Number of views
- `expires_at`: Expiration date

### experience_views
- `id`: Primary key
- `experience_id`: Foreign key
- `viewer_ip`: Viewer's IP
- `viewed_at`: View timestamp
- `user_agent`: Browser info

## 🛡️ Security Features

### Input Validation
- Required field validation
- Email format validation
- File type restrictions (video only)
- File size limits (100MB max)
- SQL injection prevention

### Rate Limiting
- Max 10 experiences per IP per day
- Prevents spam and abuse

### File Security
- Secure filename generation
- Directory traversal prevention
- MIME type validation
- Virus scanning ready

## 📈 Analytics & Monitoring

### Built-in Analytics
- View count tracking
- IP-based analytics
- User agent logging
- Experience performance metrics

### Health Monitoring
```bash
curl http://localhost:5001/health
```

### Logging
- Comprehensive application logging
- Error tracking and debugging
- Performance monitoring
- Security event logging

## 🚀 Production Deployment

### Recommended Stack
- **Web Server**: Nginx (reverse proxy)
- **WSGI Server**: Gunicorn or uWSGI
- **Database**: PostgreSQL (for production)
- **File Storage**: AWS S3 or similar
- **Monitoring**: Prometheus + Grafana

### Docker Deployment
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5001
CMD ["python", "app.py"]
```

### Environment Setup
```bash
# Production environment
export FLASK_ENV=production
export SECRET_KEY=$(openssl rand -hex 32)
export DATABASE_URL=postgresql://user:pass@host:5432/db
```

## 🔄 API Endpoints

### Public Endpoints
- `GET /` - Main form page
- `POST /create` - Create new experience
- `GET /v/{unique_id}` - View experience
- `GET /uploads/{filename}` - Serve uploaded files
- `GET /health` - Health check

### Analytics Endpoints
- `GET /api/stats/{unique_id}` - Experience statistics
- `POST /api/track` - Event tracking

## 🎭 User Experience Features

### Accessibility
- Screen reader support
- Keyboard navigation
- High contrast support
- Mobile responsive design

### Performance
- Lazy loading
- Image optimization
- CSS/JS minification ready
- CDN ready assets

### Mobile Experience
- Touch-friendly interactions
- Swipe navigation
- Responsive design
- Fast loading

## 🐛 Troubleshooting

### Common Issues

**Database locked error**
```bash
# Stop the application and restart
python app.py
```

**File upload fails**
- Check file size (max 100MB)
- Verify file type (video only)
- Ensure uploads/ directory exists

**Experience not found**
- Check URL spelling
- Verify experience hasn't expired
- Check database connection

### Debug Mode
```bash
export FLASK_ENV=development
python app.py
```

## 📝 License

This project is created for educational and personal use. Feel free to modify and distribute.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 💖 Credits

Created with love for Valentine's Day 2026. Made possible by:
- Flask web framework
- SQLite database
- Modern CSS and JavaScript
- Lots of coffee and romantic music ☕💕

---

**Happy Valentine's Day! 💕**

*Create beautiful memories, one experience at a time.*