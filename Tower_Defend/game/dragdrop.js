class Draggable {
    constructor({ src, container }) {
        this.src = src;
        this.container = container;
        this.createImage();
    }

    createImage() {
        this.image = document.createElement('img');
        this.image.src = this.src;
        this.image.className = 'draggable';
        this.image.draggable = true;
        this.image.style.position = 'absolute';

        this.image.addEventListener('dragstart', this.dragStart.bind(this));
        this.image.addEventListener('dragend', this.dragEnd.bind(this));

        this.container.appendChild(this.image);
    }

    dragStart(e) {
        e.dataTransfer.setData('text/plain', this.image.src);
        setTimeout(() => {
            this.image.style.opacity = '0.6';
        }, 0);
    }

    dragEnd(e) {
        this.image.style.opacity = '1';
    }
}

/*
* @description a field that contain *dropaple* object
*/
class Droppable {
    // destructuring
    constructor({ container }) {
        this.container = container;
        this.initDropEvents();
    }

    initDropEvents() {
        this.container.addEventListener('dragover', (e) => {
            e.preventDefault(); // Prevent default to allow drop
        });

        this.container.addEventListener('drop', (e) => {
            e.preventDefault();
            const src = e.dataTransfer.getData('text/plain');
            const draggable = Array.from(this.container.children).find(img => img.src === src);
            
            if (draggable) {
                // Get the position of the drop
                const rect = this.container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Set the position of the image
                draggable.style.left = `${x - (draggable.width / 2)}px`; // Center the image
                draggable.style.top = `${y - (draggable.height / 2)}px`; // Center the image
            }
        });
    }
}
export {Draggable, Droppable}