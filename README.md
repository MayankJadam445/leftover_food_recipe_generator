# Indian Leftover Food Recipe Generator

A modern web application that helps you find delicious Indian recipes using your leftover ingredients, reducing food waste while enjoying authentic cuisine.

## 🚀 Features -gen 2

- **Indian Recipe Prioritization**: Search results prioritize authentic Indian dishes
- **Smart Ingredient Search**: Find recipes by entering ingredients you have
- **Random Recipe Generator**: Get surprise Indian recipe suggestions
- **Detailed Recipe View**: Complete ingredients list, instructions, and video links
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Fast Performance**: Optimized with caching and efficient API calls

## 🏗️ Project Structure

```
Recipe-Finder/
├── index.html                          # Main HTML file
├── assets/
│   ├── css/
│   │   ├── main.css                    # Main styles
│   │   └── components.css              # Component-specific styles
│   ├── js/
│   │   ├── config/
│   │   │   └── config.js              # Application configuration
│   │   ├── services/
│   │   │   ├── apiService.js          # API communication layer
│   │   │   └── recipeService.js       # Recipe business logic
│   │   ├── components/
│   │   │   ├── recipeDisplay.js       # Recipe rendering component
│   │   │   └── searchComponent.js     # Search functionality
│   │   ├── utils/
│   │   │   └── domUtils.js           # DOM utility functions
│   │   └── app.js                    # Main application entry point
│   └── images/                       # Images and assets
├── main.js                          # Legacy file (replaced)
├── style.css                        # Legacy file (replaced)
└── README.md                        # This file
```

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **API**: TheMealDB API
- **Architecture**: Component-based modular structure
- **Styling**: CSS Grid, Flexbox, CSS Custom Properties
- **Performance**: Client-side caching, lazy loading

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Recipe-Finder
   ```

2. **Start a local server**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have it)
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**:
   Navigate to `http://localhost:8000`

## 🎯 Usage

1. **Search by Ingredient**: Type ingredients like "chicken", "rice", "paneer" in the search box
2. **Get Random Recipe**: Click the "Get Random Indian Recipe" button
3. **View Details**: Click on any recipe card to see full details
4. **Watch Videos**: Many recipes include YouTube video links

## 🔧 Configuration

The application can be configured by modifying `assets/js/config/config.js`:

- **API endpoints**: Customize API URLs
- **Indian keywords**: Add more cuisine-specific terms
- **UI messages**: Customize user-facing text
- **Performance settings**: Adjust cache duration and limits

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main`)

### Netlify
1. Connect repository to Netlify
2. Deploy with default settings (no build process required)

### Vercel
1. Import project to Vercel
2. Deploy as static site

### Traditional Web Hosting
1. Upload all files to web server
2. Ensure server can serve static files
3. Point domain to the uploaded files

## 🧪 Testing

The application includes error handling and can be tested by:

1. **Searching for various ingredients**
2. **Testing with no internet connection**
3. **Testing on different devices and screen sizes**
4. **Checking accessibility with screen readers**

## 🔒 Security Features

- **Input sanitization**: All user inputs are sanitized
- **XSS prevention**: HTML content is properly escaped
- **HTTPS ready**: Works with secure connections
- **No sensitive data**: Application doesn't store personal information

## 📱 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- **API**: [TheMealDB](https://www.themealdb.com/) for recipe data
- **Fonts**: Google Fonts (Poppins)
- **Icons**: Custom CSS icons and emojis

## 📞 Support

For issues and questions:
1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Include browser information and steps to reproduce

---

**Enjoy cooking delicious Indian recipes! 🍛**
