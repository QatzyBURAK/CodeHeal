# 🚀 CodeHeal - Quick Start Guide

Get CodeHeal up and running in 2 minutes!

## ⚡ Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

## 🎯 First Analysis

1. **The app loads with demo Python code** - You'll see a sample with intentional bugs
2. **Click "ANALYZE CODE"** - Watch the smooth animations as results appear
3. **Review the results**:
   - Summary stats show total issues by severity
   - Bottleneck card highlights critical performance issues
   - Results table lists all detected problems
4. **Click "FIX ALL ISSUES"** - See the before/after comparison
5. **Click "DOWNLOAD REPORT"** - Get a comprehensive markdown report

## 🔧 Backend Setup (Optional)

If you have a backend API:

1. Create `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

2. Ensure your backend has these endpoints:
   - `POST /analyze` - Analyzes code
   - `POST /fix` - Fixes code issues

**Note**: The app works with mock data if no backend is available!

## 🎨 What Makes It Special

- **Cyberpunk UI** - Dark theme with electric blue/green accents
- **Smooth Animations** - Powered by anime.js
- **Glassmorphism** - Modern frosted glass effects
- **Real-time Analysis** - Instant feedback on code quality
- **One-Click Fix** - Automatically optimizes your code
- **Before/After Viewer** - Side-by-side comparison with line numbers

## 📱 Features at a Glance

| Feature | Description |
|---------|-------------|
| 🔍 **Code Analysis** | Detects bugs, performance issues, code quality problems |
| ⚡ **Bottleneck Detection** | Identifies critical performance bottlenecks |
| 🛠️ **Auto-Fix** | One-click code optimization |
| 📊 **Visual Reports** | Color-coded severity levels (HIGH/MED/LOW) |
| 💾 **Export** | Download comprehensive markdown reports |
| 🎨 **Animations** | Professional transitions and effects |

## 🎯 Example Use Cases

### 1. Performance Optimization
```python
# Before: Slow loop
for i in range(len(df)):
    df.iloc[i, 0] = df.iloc[i, 0] * 2

# After: Vectorized operation (100x faster!)
df.iloc[:, 0] = df.iloc[:, 0] * 2
```

### 2. Bug Detection
```python
# Before: Division by zero error
result = df['column'] / 0

# After: Safe division with error handling
try:
    result = df['column'] / df['divisor']
except ZeroDivisionError:
    result = df['column']
```

### 3. Code Quality
```python
# Before: Unused variable
unused_var = "This is never used"

# After: Clean code (removed)
```

## 🎨 UI Highlights

### Color Scheme
- **Background**: Deep space black (#0a0a0f)
- **Cards**: Dark gray (#12121a) with glassmorphism
- **Accents**: Electric blue (#00d4ff), Neon green (#00ff88), Alert red (#ff4455)

### Typography
- **UI**: Space Grotesk (modern, geometric)
- **Code**: JetBrains Mono (developer-friendly)

### Animations
- Page load: Staggered fade-in
- Analyze: Ripple effect + loading pulse
- Results: Row-by-row slide-in
- Fix complete: Green flash effect
- Numbers: Count-up animation

## 🐛 Troubleshooting

**Q: Animations not working?**  
A: Check browser console. Anime.js should load from CDN.

**Q: Styles look broken?**  
A: Restart dev server: `npm run dev`

**Q: API errors?**  
A: App uses mock data as fallback. Check `.env` for correct backend URL.

**Q: Fonts not loading?**  
A: Check internet connection. Fonts load from Google Fonts CDN.

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize colors in `tailwind.config.js`
- Modify mock data in `src/App.jsx`
- Connect your own backend API
- Deploy to production with `npm run build`

## 🎉 That's It!

You're ready to analyze and optimize Python code with style!

---

**Need help?** Open an issue on GitHub or check the full README.