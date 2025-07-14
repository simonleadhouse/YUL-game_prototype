### **YUL Duty-Free Game: Branding Guidelines**

#### **1\. Introduction**

This document outlines the branding and visual style for the YUL Duty-Free game. The goal is to align the game's aesthetic with the official YUL Montréal-Trudeau Airport brand, creating a cohesive and professional user experience. The brand's identity is modern, clean, efficient, and welcoming.

#### **2\. Color Palette**

The color palette is derived from the vibrant promotional colors used on the YUL website. Use the Primary colors for dominant interactive elements and the Accent colors for secondary actions or highlights.

| Color | Hex Code | Usage |
| :---- | :---- | :---- |
| **Primary** |  |  |
| YUL Red | \#E30613 | Primary buttons, key highlights, active states |
| Pure White | \#FFFFFF | Main backgrounds, text on dark backgrounds, cards |
| **Accent** |  |  |
| YUL Pink | \#D4007A | Secondary buttons, alternative highlights |
| YUL Green | \#8BC53F | Success messages, positive actions |
| **Neutral** |  |  |
| Text Charcoal | \#231F20 | Body text, headings |
| Light Grey | \#F2F2F2 | Card backgrounds, dividers, disabled states |

#### **3\. Typography**

The official YUL brand uses a specific font ("Averta") which may require licensing. For broad compatibility and ease of use in a web game, we recommend using **"Inter"**, a free and versatile Google Font that closely matches the clean, modern, and highly legible style of the YUL brand.

* **Headings (h1, h2, h3):** Inter, Bold (700 weight)  
* **Body Text & UI Elements:** Inter, Regular (400 weight)  
* **Buttons & Labels:** Inter, Medium (500 or 600 weight)

Implementation:  
Import Inter from Google Fonts in your HTML's \<head\>:  
\<link rel="preconnect" href="https://fonts.googleapis.com"\>  
\<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin\>  
\<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700\&display=swap" rel="stylesheet"\>

And apply it in your CSS:

body {  
  font-family: 'Inter', sans-serif;  
  color: \#231F20;  
}

h1, h2, h3 {  
  font-weight: 700;  
}

#### **4\. Iconography**

Icons should be simple, clean, and functional.

* **Style:** Use single-color, line-art (outline) icons. Avoid filled, multi-color, or overly detailed icons.  
* **Color:** Icons should typically use the **YUL Red (\#E30613)** or **Text Charcoal (\#231F20)** against light backgrounds.  
* **Recommendation:** Use a library like [Lucide Icons](https://lucide.dev/) or [Feather Icons](https://feathericons.com/) for a consistent and modern look.

#### **5\. UI Elements & Layout**

* **Buttons:**  
  * **Primary Action:** Solid **YUL Red** background with white text.  
  * **Secondary Action:** Solid **YUL Pink** or **YUL Green** background with white text.  
  * **Shape:** Use a subtle corner radius (e.g., border-radius: 8px;). Avoid sharp corners or fully pill-shaped buttons.  
  * **Effects:** Buttons should have a subtle transition effect on hover/press (e.g., slight brightness change or lift).  
* **Cards & Panels:**  
  * Use cards to contain game elements or information.  
  * Give them a white (\#FFFFFF) or light grey (\#F2F2F2) background.  
  * Apply a subtle box-shadow and a border-radius of 12px to 16px to make them feel modern and lift off the page.  
* **Layout:**  
  * **Whitespace:** Be generous with whitespace. A clean, uncluttered layout is key to the YUL brand.  
  * **Alignment:** Use a grid-based layout to ensure all elements are properly aligned.  
  * **Responsiveness:** The design must be fully responsive and work flawlessly on mobile devices, tablets, and desktops.

#### **6\. Tone of Voice**

The language used in the game should be:

* **Clear & Concise:** Instructions should be easy to understand.  
* **Welcoming:** Use a friendly and helpful tone.  
* **Professional:** Avoid slang or overly casual language. The voice should reflect a world-class airport experience.