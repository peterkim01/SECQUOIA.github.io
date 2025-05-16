document.addEventListener('DOMContentLoaded', function() {
  // Tag all images that will need WebP versions
  var imagesToUpdate = document.querySelectorAll('img:not([src$=".svg"]):not([src$=".webp"]):not([src$=".avif"])');
  imagesToUpdate.forEach(function(img) {
    if (img.src && (img.src.endsWith('.jpg') || img.src.endsWith('.jpeg') || img.src.endsWith('.png'))) {
      var parent = img.closest('.image');
      if (parent) {
        parent.setAttribute('data-webp', 'pending');
      }
    }
  });

  // Process WebP replacements only when browser supports it
  if (document.documentElement.classList.contains('webp')) {
    // Handle <img> tags
    imagesToUpdate.forEach(function(img) {
      if (img.src && (img.src.endsWith('.jpg') || img.src.endsWith('.jpeg') || img.src.endsWith('.png'))) {
        // Create WebP path
        var webpSrc = img.src.substring(0, img.src.lastIndexOf('.')) + '.webp';
        
        // Handle picture element creation
        var parent = img.parentNode;
        if (parent.tagName.toLowerCase() !== 'picture') {
          // Create picture element
          var picture = document.createElement('picture');
          var source = document.createElement('source');
          source.srcset = webpSrc;
          source.type = 'image/webp';
          
          // Replace img with picture
          parent.insertBefore(picture, img);
          picture.appendChild(source);
          picture.appendChild(img);
        }
      }
    });
    
    // Handle CSS background images
    document.querySelectorAll('.banner, .spotlight, [style*="background-image"]').forEach(function(el) {
      var style = window.getComputedStyle(el).backgroundImage;
      if (style && (style.includes('.jpg') || style.includes('.jpeg') || style.includes('.png'))) {
        // Extract the image URL
        var match = style.match(/url\(['"]?([^'"")]+)['"]?\)/);
        if (match && match[1]) {
          var imgUrl = match[1];
          var webpUrl = imgUrl.substring(0, imgUrl.lastIndexOf('.')) + '.webp';
          
          // Apply WebP background
          el.style.backgroundImage = 'url(' + webpUrl + ')';
        }
      }
    });
  }

  // Mark all WebP operations as complete (with a slight delay to ensure transitions work)
  setTimeout(function() {
    document.querySelectorAll('[data-webp="pending"]').forEach(function(el) {
      el.setAttribute('data-webp', 'complete');
    });
  }, 100);
});