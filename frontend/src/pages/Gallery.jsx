import { useState } from "react";

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    {
      src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80",
      thumb: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&auto=format&fit=crop&q=80",
      alt: "TechFest 2026 Keynote Address in MBCET Auditorium",
      title: "Opening Ceremony",
    },
    {
      src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80",
      thumb: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&auto=format&fit=crop&q=80",
      alt: "Students actively collaborating at TechFest Hackathon",
      title: "24-Hour Hackathon",
    },
    {
      src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80",
      thumb: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&auto=format&fit=crop&q=80",
      alt: "Robotics arena demonstration and obstacle course challenge",
      title: "RoboWars Arena",
    },
    {
      src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80",
      thumb: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&auto=format&fit=crop&q=80",
      alt: "Panel discussion featuring tech industry leaders and alumni",
      title: "Tech Panel Discussion",
    },
  ];

  return (
    <div className="page">
      <h1>Event Gallery</h1>
      <p>High-resolution snapshots from previous TechFest editions (optimized with Lazy Loading):</p>
      
      <div className="gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
        {images.map((img, index) => (
          <div
            key={index}
            className="gallery-item"
            style={{ cursor: "pointer", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={img.thumb}
              alt={img.alt}
              loading="lazy"
              width="300"
              height="200"
              style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
            />
            <div style={{ padding: "0.5rem", fontWeight: "bold", fontSize: "0.9rem" }}>{img.title}</div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div style={{ maxWidth: "800px", background: "#fff", padding: "1rem", borderRadius: "8px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: "4px" }}
            />
            <h3>{selectedImage.title}</h3>
            <p>{selectedImage.alt}</p>
            <button onClick={() => setSelectedImage(null)}>Close Preview</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
