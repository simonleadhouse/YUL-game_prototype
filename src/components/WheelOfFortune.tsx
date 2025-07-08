import { useEffect, useRef, useState } from "react";

interface WheelOfFortuneProps {
    onBackToSelection: () => void;
}

const WheelOfFortune = ({ onBackToSelection }: WheelOfFortuneProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [currentRotation, setCurrentRotation] = useState(0); // This state is for React to track and re-render if needed
    const [winningPrize, setWinningPrize] = useState<string | null>(null);
    const animationRef = useRef<number>(); // Holds the requestAnimationFrame ID
    const wheelSpinStartTime = useRef<number>(); // Holds the start time of the spin

    // Use a ref to store the actual rotation value during animation
    // This allows renderWheel to get the latest rotation without causing
    // a React re-render on every animation frame.
    const animationRotationRef = useRef(0);

    // Customizable Prize Data
    const PRIZES = [
        { code: "FRDRN", prize: "Free Drink", color: "#FF6B6B" }, // Red
        { code: "10OFF", prize: "10% Off Voucher", color: "#4ECDC4" }, // Teal
        { code: "GFTC1", prize: "Gift Card $10", color: "#45B7D1" }, // Blue
        { code: "SNKPK", prize: "Snack Pack", color: "#96CEB4" }, // Green
        { code: "TRVPL", prize: "Travel Pillow", color: "#FFEAA7" }, // Yellow
        { code: "MAGRD", prize: "Magazine Read", color: "#DDA0DD" }, // Plum
        { code: "WTBTL", prize: "Water Bottle", color: "#FFA07A" }, // Light Salmon
        { code: "KEYCH", prize: "Keychain", color: "#98D8C8" }, // Mint
        { code: "CANDY", prize: "Candy Bar", color: "#F0B27A" }, // Orange-ish
        { code: "DISC5", prize: "5% Discount", color: "#A9A9A9" }, // Dark Gray
    ];

    const PRIZE_LABELS = ["10% Discount", "Free Coffee", "Gift Card $25", "Duty Free Bag", "5% Discount", "Free Chocolate", "Gift Card $50", "Premium Upgrade"];

    // Wheel configuration
    const WHEEL_SEGMENTS = PRIZES.length;
    // SEGMENT_COLORS are now part of PRIZES array
    // PRIZE_LABELS are now part of PRIZES array

    const drawWheel = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, rotation: number = 0) => {
        const anglePerSegment = (2 * Math.PI) / WHEEL_SEGMENTS;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.translate(-centerX, -centerY);

        // Draw each segment
        for (let i = 0; i < WHEEL_SEGMENTS; i++) {
            const startAngle = i * anglePerSegment - Math.PI / 2;
            const endAngle = (i + 1) * anglePerSegment - Math.PI / 2;

            // Draw segment
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = PRIZES[i].color; // Use color from PRIZES
            ctx.fill();
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 3;
            ctx.stroke();

            // Draw segment text (displaying the 5-char code)
            const textAngle = startAngle + anglePerSegment / 2;
            const textX = centerX + Math.cos(textAngle) * (radius * 0.65); // Adjusted radius for text
            const textY = centerY + Math.sin(textAngle) * (radius * 0.65); // Adjusted radius for text

            ctx.save();
            ctx.translate(textX, textY);
            ctx.rotate(textAngle + Math.PI / 2);
            ctx.fillStyle = "#000000"; // Black text for better contrast on light colors
            ctx.font = "bold 18px Arial"; // Slightly larger font
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(PRIZES[i].code, 0, 0); // Display prize code
            ctx.restore();
        }

        ctx.restore();

        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "#2C3E50";
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 3;
        ctx.stroke();
    };

    const spinWheel = () => {
        if (isSpinning) return;

        console.log("Starting wheel spin...");
        setIsSpinning(true);
        setWinningPrize(null);

        // Cancel any existing animation
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        // Randomly select target segment
        const targetSegment = Math.floor(Math.random() * WHEEL_SEGMENTS);
        const anglePerSegment = (2 * Math.PI) / WHEEL_SEGMENTS;

        console.log(`Target segment: ${targetSegment}, Prize Code: ${PRIZES[targetSegment].code}, Prize: ${PRIZES[targetSegment].prize}`);

        // Calculate target angle - we want to land in the center of the target segment
        // The pointer points to the top, so we need to calculate accordingly
        const targetAngleInSegment = targetSegment * anglePerSegment;
        const centerOfSegmentOffset = anglePerSegment / 2;
        const pointerOffset = Math.PI / 2; // Pointer points to top

        // Add multiple full rotations (3-6 full spins) plus the target angle
        const minSpins = 3;
        const maxSpins = 6;
        const fullRotations = minSpins + Math.random() * (maxSpins - minSpins);
        const baseRotation = fullRotations * 2 * Math.PI;

        // Calculate final target rotation
        const finalTargetRotation = baseRotation + (2 * Math.PI - targetAngleInSegment - centerOfSegmentOffset + pointerOffset);

        console.log(`Full rotations: ${fullRotations}, Final target: ${finalTargetRotation}`);

        // Animation parameters
        const duration = 4000; // 4 seconds
        const startTime = performance.now();
        const startRotation = currentRotation;

        const animate = (currentTime: number) => {};

        animationRef.current = requestAnimationFrame(animate);
    };

    const drawPointer = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
        const pointerSize = 30;
        const pointerY = centerY - radius - 10;

        // Draw triangle pointer
        ctx.beginPath();
        ctx.moveTo(centerX, pointerY);
        ctx.lineTo(centerX - pointerSize / 2, pointerY - pointerSize);
        ctx.lineTo(centerX + pointerSize / 2, pointerY - pointerSize);
        ctx.closePath();
        ctx.fillStyle = "#E74C3C";
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 3;
        ctx.stroke();
    };

    // This function can now get the rotation from the ref or a passed value
    const renderWheel = (rotation: number = animationRotationRef.current) => {
        // Default to ref value
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.35;

        // Draw wheel and pointer
        drawWheel(ctx, centerX, centerY, radius, rotation);
        drawPointer(ctx, centerX, centerY, radius);
    };

    const determineWinningSegment = (finalRotation: number): number => {
        const anglePerSegment = (2 * Math.PI) / WHEEL_SEGMENTS;
        const normalizedRotation = ((finalRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

        // The pointer points to the top, so we need to account for that
        const pointerAngle = Math.PI / 2; // 90 degrees offset for top position
        const adjustedAngle = (normalizedRotation + pointerAngle) % (2 * Math.PI);

        // Determine which segment the pointer is pointing to
        const segmentIndex = Math.floor(adjustedAngle / anglePerSegment);
        return (WHEEL_SEGMENTS - segmentIndex - 1) % WHEEL_SEGMENTS;
    };

    // A separate useEffect to draw the initial wheel or when currentRotation changes (e.g., reset)
    useEffect(() => {
        // This will ensure the initial render and re-render on reset (handleNewSpin)
        renderWheel(currentRotation);
        // Also update the ref with the state's rotation when it changes via state
        animationRotationRef.current = currentRotation;
    }, [currentRotation]); // This dependency is fine here

    // Separate useEffect for handling component unmount cleanup
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const handleBackToGames = () => {
        if (isSpinning) return;
        onBackToSelection();
    };

    const handleNewSpin = () => {
        setWinningPrize(null);
        setCurrentRotation(0);
        renderWheel(0);
    };

    return (
        <div className="h-full w-full flex flex-col relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/assets/wheel-background.png')" }}>
            {/* Fallback background color if image fails to load or for transparency in image */}
            <div className="absolute inset-0 bg-indigo-900 opacity-75 -z-10"></div>

            {/* Header */}
            <div className="flex justify-center items-center p-8 z-10">
                <div className="text-center">
                    <div className="text-4xl md:text-6xl font-bold text-white mb-4">🎯 WHEEL OF FORTUNE 🎯</div>
                    <div className="text-2xl md:text-3xl text-slate-300">Spin to Win Amazing Prizes!</div>
                    <div className="text-lg md:text-xl text-slate-400 mt-2">{isSpinning ? "Spinning..." : winningPrize ? "Congratulations!" : "Get ready for your reward"}</div>
                </div>
            </div>

            {/* Wheel Canvas Container */}
            <div className="flex-1 p-8 flex items-center justify-center">
                <div className="relative max-w-2xl max-h-2xl w-full h-full">
                    <canvas ref={canvasRef} className="w-full h-full border-4 border-white/20 rounded-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 shadow-2xl" />
                </div>
            </div>

            {/* Prize Display */}
            {winningPrize && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-20">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-2xl shadow-2xl text-center border-4 border-white max-w-md mx-4">
                        <div className="text-4xl mb-4">🎉</div>
                        <div className="text-2xl font-bold text-white mb-1">Congratulations! You've Won:</div>
                        <div className="text-xl font-semibold text-slate-800 bg-white/80 px-4 py-2 rounded-md mb-2">
                            Code: <span className="font-bold text-2xl">{winningPrize?.split(" - ")[0]?.replace("Code: ", "")}</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-6">{winningPrize?.split(" - ")[1]}</div>
                        <div className="space-y-4">
                            <button
                                onClick={handleNewSpin}
                                className="w-full bg-white text-orange-600 px-6 py-3 rounded-xl text-xl font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Spin Again
                            </button>
                            <button
                                onClick={handleBackToGames}
                                className="w-full bg-slate-700 text-white px-6 py-3 rounded-xl text-xl font-semibold hover:bg-slate-600 transition-colors"
                            >
                                Back to Games
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Control Buttons */}
            <div className="p-8 flex justify-center space-x-8">
                <button
                    onClick={handleBackToGames}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-colors border border-slate-600 disabled:opacity-50"
                    disabled={isSpinning}
                >
                    Back to Games
                </button>
                <button
                    onClick={spinWheel}
                    className={`px-16 py-6 rounded-xl text-3xl font-bold transition-all shadow-lg transform ${
                        isSpinning
                            ? "bg-gray-600 cursor-not-allowed opacity-75"
                            : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white hover:scale-105 shadow-yellow-500/25"
                    }`}
                    disabled={isSpinning}
                >
                    {isSpinning ? "SPINNING..." : "🎰 SPIN THE WHEEL! 🎰"}
                </button>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                <div className="bg-black/40 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
                    <div className="text-white text-lg font-semibold">{isSpinning ? "The wheel is spinning!" : "Click the SPIN button to try your luck!"}</div>
                    <div className="text-slate-300 text-sm">8 amazing prizes waiting for you</div>
                </div>
            </div>
        </div>
    );
};

export default WheelOfFortune;
