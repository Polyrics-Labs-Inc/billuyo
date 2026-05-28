# High-Fidelity Claymorphism Design System

## Design Philosophy

**Core Concept: Digital Clay**
This design system is not merely a "soft UI"—it is a high-fidelity simulation of a tangible, physical world constructed from **premium digital clay**. Every element on the screen should evoke the sensation of holding a high-end, matte-finish vinyl toy or a soft, air-filled silicone object. It rejects the flatness of modern minimalism in favor of volume, weight, and tactility.

**The "High-Fidelity" Difference**:
Unlike early 2020s "Neumorphism" (which felt like extruded plastic) or basic "Claymorphism" (which often feels like flat vector art), **High-Fidelity Claymorphism** relies on complex, multi-layered lighting simulation using 4-layer shadow stacks. It renders objects that feel dense, substantial, and interactive—not hollow decorations.

*   **Materiality**: Think of soft-touch matte silicone, marshmallow-like foam, or high-quality injection-molded plastic with a premium finish. Surfaces absorb light rather than reflecting it sharply, creating a warm, inviting aesthetic.
*   **Lighting**: The "world" is lit by a soft, diffused overhead light source positioned top-left, creating deep ambient occlusion shadows below objects and gentle specular highlights on their upper ridges. This creates the illusion of physical depth.
*   **Shadow Architecture**: Every element uses carefully crafted multi-layer shadows:
    - **Outer shadows**: Soft, colored drop shadows that define distance from the surface
    - **Highlight shadows**: Top-left highlights that simulate light reflection
    - **Inner shadows**: Subtle colored reflections and rim lights that add dimensionality
    - **Active states**: Pressed elements use inset shadows to simulate physical depression

**The Sensory Vibe**:
*   **Playful & Optimistic**: The interface radiates joy through "candy store" colors (vivid violets, hot pinks, sky blues, emerald greens, amber oranges) and bouncy, organic motion. It feels safe, welcoming, and unpretentious—like a premium toy store display.
*   **Tactile & Responsive**: Elements don't just change color when interacted with—they physically react with exaggerated realism. Buttons actively "squish" (scale-[0.92] + shadow-clayPressed) and compress under the cursor. Cards lift and float towards the user (-translate-y-2 with enhanced shadows). Every interaction provides satisfying visual feedback.
*   **Friendly & Safe**: There are **zero sharp corners** in this universe. Every edge is aggressively rounded (`rounded-[20px]` minimum, up to `rounded-[60px]` for large containers), subconsciously signaling safety and approachability to the user. The design language speaks "friendly" and "accessible" without words.
*   **Premium Craft**: Despite the playfulness, this aesthetic maintains a sense of quality through careful attention to detail: consistent border radii, precise shadow layering, harmonious color relationships, and smooth micro-interactions.

**The "Clay" Physics Engine**:
1.  **Convexity (The Bulge)**: Primary interactive elements (Buttons, Stat orbs, Feature cards) bulge OUT towards the user with `shadow-clayButton` or `shadow-clayCard`. They capture light on their top-left edge and cast soft colored shadows below, creating the illusion of floating above the surface.
2.  **Concavity (The Press)**: Secondary surfaces (Input fields, Active button states, FAQ panels when open) are pressed INTO the clay surface with `shadow-clayPressed`. They cast internal shadows on their top edge and catch light on their bottom lip, making them feel recessed.
3.  **Buoyancy (The Float)**: The interface exists in a zero-gravity environment with high air resistance. Background blobs drift slowly (8-12s animations with translateY and rotate). Cards hover effortlessly with hover states that amplify the float effect. Nothing feels statically "stuck" to the grid—everything breathes and moves subtly.
4.  **Micro-Physics**: Hover states consistently lift elements upward (`hover:-translate-y-1` to `-translate-y-2`) while enhancing their shadows, simulating the element floating closer to the viewer. Active/pressed states do the opposite—compressing downward with reduced shadows.