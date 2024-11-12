document.addEventListener('DOMContentLoaded', function() {
    // Function to check image orientation and add portrait class
    function checkImageOrientation(imgElement) {
        const tempImage = new Image();
        tempImage.src = imgElement.src;
        
        tempImage.onload = function() {
            if (this.height > this.width) {
                imgElement.closest('.artwork-item').classList.add('portrait');
            }
        };
    }

    // Get all gallery images and check orientation
    const galleryImages = document.querySelectorAll('.artwork-item img');
    galleryImages.forEach(img => {
        if (img.complete) {
            checkImageOrientation(img);
        } else {
            img.onload = function() {
                checkImageOrientation(this);
            };
        }
    });

    // Gallery functionality
    const grid = document.querySelector('.masonry-grid');
    const fullsizeView = document.querySelector('.fullsize-view');
    const fullsizeImage = fullsizeView.querySelector('img');
    const closeButton = document.querySelector('.close-button');
    const artworkDetails = document.querySelector('.artwork-details');

    // Handle clicking on artwork
    grid.addEventListener('click', function(e) {
        const artwork = e.target.closest('.artwork-item');
        if (artwork) {
            const fullsizeUrl = artwork.dataset.full;
            const info = artwork.querySelector('.artwork-info').cloneNode(true);
            
            fullsizeImage.src = fullsizeUrl;
            artworkDetails.innerHTML = info.innerHTML;
            fullsizeView.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    // Close fullsize view
    closeButton.addEventListener('click', function() {
        fullsizeView.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close on click outside image
    fullsizeView.addEventListener('click', function(e) {
        if (e.target === fullsizeView) {
            fullsizeView.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && fullsizeView.classList.contains('active')) {
            fullsizeView.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        // Check orientation after loading
                        checkImageOrientation(img);
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Optional: Add keyboard navigation for fullsize view
    document.addEventListener('keydown', function(e) {
        if (!fullsizeView.classList.contains('active')) return;
        
        const currentArtwork = document.querySelector(`[data-full="${fullsizeImage.src}"]`);
        if (!currentArtwork) return;

        let nextArtwork;
        if (e.key === 'ArrowRight') {
            nextArtwork = currentArtwork.nextElementSibling;
        } else if (e.key === 'ArrowLeft') {
            nextArtwork = currentArtwork.previousElementSibling;
        }

        if (nextArtwork && nextArtwork.classList.contains('artwork-item')) {
            const fullsizeUrl = nextArtwork.dataset.full;
            const info = nextArtwork.querySelector('.artwork-info').cloneNode(true);
            
            fullsizeImage.src = fullsizeUrl;
            artworkDetails.innerHTML = info.innerHTML;
        }
    });
});