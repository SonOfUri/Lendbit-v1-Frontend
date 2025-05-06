

export default function Background() {
    return (
        <section className="w-full min-h-screen bg-cover relative z-0 overflow-hidden bg-black">
            <img
                className="object-cover w-full max-w-screen max-h-screen" 
                src="/bg.svg"
                alt="background"
                
            />
        </section>
    );
}