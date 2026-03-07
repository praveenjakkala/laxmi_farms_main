export default function Loading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
                <div className="relative w-14 h-14 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
                </div>
                <p className="text-warm-500 text-sm font-medium">Loading...</p>
            </div>
        </div>
    );
}
