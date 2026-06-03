import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

function Home() {
    return (
        <div>
            <Navbar />
            <Hero />
            <section className="features">
                <div className="card">
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>📱</div>
                    <h2>GitHub Import</h2>
                    <p>Automatically fetch and showcase your GitHub repositories with one click. Display your best projects instantly.</p>
                </div>
                <div className="card">
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>🎨</div>
                    <h2>Responsive Templates</h2>
                    <p>Choose from professionally designed templates that look stunning on all devices. Mobile-first approach.</p>
                </div>
                <div className="card">
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>⚙️</div>
                    <h2>Easy Customization</h2>
                    <p>Customize colors, fonts, and layouts to match your personal brand. No coding required.</p>
                </div>
            </section>
            <section style={{ padding: '80px 40px', textAlign: 'center', background: 'rgba(79, 70, 229, 0.1)' }}>
                <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>Why Choose Portfolio Builder?</h2>
                <p style={{ fontSize: '18px', maxWidth: '700px', margin: '0 auto', color: '#cbd5e1' }}>
                    Create a professional portfolio in minutes, not hours. Perfect for developers, designers, and creative professionals.
                </p>
            </section>
        </div>
    );
}
export default Home;