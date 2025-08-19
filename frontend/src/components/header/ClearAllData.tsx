import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function ClearAllData() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifying, setNotifying] = useState(true);
    const [confirmed, setConfirmed] = useState(false);

    const x = useMotionValue(0);

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    useEffect(() => {
        if (confirmed) {
            const clearAll = async () => {
                try {
                    const res = await fetch("http://localhost:3002/api/clear-all-data");
                    const data = await res.json();

                    if (data.success) {
                        console.log("✅ Tables cleared successfully");
                    } else {
                        console.error("❌ Failed to clear tables:", data.error);
                    }
                } catch (err) {
                    console.error("❌ Error clearing tables:", err);
                }
            };
            clearAll();
        }
    }, [confirmed]);

    const handleClick = () => {
        toggleDropdown();
        setNotifying(false);
    };

    // 👇 Reset swipe state whenever dropdown opens
    useEffect(() => {
        if (isOpen) {
            setConfirmed(false);
            x.set(0);
        }
    }, [isOpen, x]);

    return (
        <div className="relative">
            {/* upload trigger button (notification bell) */}
            <button
                className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={handleClick}
            >
                {notifying && (
                    <span className="absolute right-0 top-0.5 z-10 flex h-2 w-2 rounded-full bg-error-700">
                        <span className="absolute inline-flex w-full h-full bg-error-700 rounded-full opacity-75 animate-ping"></span>
                    </span>
                )}

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 text-current" fill="currentColor">
                    <path d="M512 192.36c0-20.033-7.801-38.867-21.967-53.033L405.18 54.475c-14.166-14.166-33-21.967-53.033-21.967s-38.867 7.801-53.033 21.967L86.982 266.607c-29.243 29.243-29.243 76.824 0 106.066l102.426 102.426a15 15 0 0 0 10.606 4.394H497c8.284 0 15-6.716 15-15s-6.716-15-15-15H285.934l204.099-204.099c14.166-14.166 21.967-33 21.967-53.034zM243.507 449.492h-37.279l-98.033-98.033c-17.545-17.546-17.545-46.094 0-63.64l95.459-95.459 148.493 148.493zM468.82 224.18l-95.46 95.459-148.492-148.492 95.459-95.459c17.546-17.545 46.095-17.544 63.64 0l84.853 84.853c17.545 17.545 17.545 46.094 0 63.639zM62 434.492c0-8.284-6.716-15-15-15H15c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.715 15-15zM10.787 353.28c-5.858 5.858-5.858 15.355 0 21.213L32 395.705c2.929 2.929 6.768 4.394 10.606 4.394s7.678-1.464 10.606-4.394c5.858-5.858 5.858-15.355 0-21.213L32 353.28c-5.857-5.859-15.355-5.859-21.213 0z" />
                </svg>
            </button>

            {/* Dropdown */}
            <Dropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
            >
                <div className="relative mt-3 h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    {!confirmed ? (
                        <motion.div
                            className="absolute top-0 left-0 h-full w-12 flex items-center justify-center bg-red-500 text-white rounded-full cursor-pointer"
                            drag="x"
                            dragConstraints={{ left: 0, right: 220 }}
                            dragElastic={0}
                            style={{ x }}
                            onDragEnd={(event, info) => {
                                if (info.point.x > 150) {
                                    setConfirmed(true);
                                } else {
                                    x.set(0);
                                }
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            ➡
                        </motion.div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-green-400 font-semibold">
                            ✅ Data Cleared
                        </div>
                    )}
                    {!confirmed && (
                        <span className="absolute inset-0 flex items-center justify-center text-sm text-gray-600 dark:text-gray-300 pointer-events-none">
                            Swipe to Clear Data →
                        </span>
                    )}
                </div>
            </Dropdown>
        </div>
    );
}
