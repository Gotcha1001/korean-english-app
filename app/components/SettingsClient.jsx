"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SettingsClient({
    targetLanguage,
    success,
    error,
    savePreferences
}) {
    const [isHovered, setIsHovered] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9, rotateX: 10 },
        visible: {
            opacity: 1,
            scale: 1,
            rotateX: 0,
            transition: {
                duration: 0.7,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.02,
            rotateX: 2,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            boxShadow: "0 20px 25px -5px rgba(139, 92, 246, 0.4), 0 10px 10px -5px rgba(139, 92, 246, 0.04)",
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        tap: {
            scale: 0.98,
            transition: {
                duration: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-800/20 via-transparent to-indigo-800/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,92,246,0.1)_0%,_transparent_50%)]" />
                {/* Floating Orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, 30, -30, 0],
                        y: [0, -20, 20, 0],
                        scale: [1, 1.1, 0.9, 1]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-3/4 right-1/4 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, -40, 40, 0],
                        y: [0, 30, -30, 0],
                        scale: [1, 0.8, 1.2, 1]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <motion.div
                className="relative z-10 p-10 text-white"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-purple-200 via-purple-100 to-indigo-200 bg-clip-text text-transparent"
                    variants={itemVariants}
                >
                    언어 설정
                </motion.h1>

                <div className="max-w-lg mx-auto">
                    <motion.div
                        className="relative backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl"
                        variants={cardVariants}
                        whileHover="hover"
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                    >
                        {/* Glass Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-3xl" />
                        <div className="relative z-10">
                            {/* Success/Error Messages */}
                            {success && (
                                <motion.div
                                    className="bg-green-500/20 border border-green-400/30 text-green-100 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    설정이 성공적으로 저장되었습니다.
                                </motion.div>
                            )}
                            {error && (
                                <motion.div
                                    className="bg-red-500/20 border border-red-400/30 text-red-100 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    설정 저장에 실패했습니다: {error}
                                </motion.div>
                            )}

                            <form action={savePreferences}>
                                <motion.div className="mb-6" variants={itemVariants}>
                                    <label className="block text-lg font-semibold mb-3 text-purple-100">
                                        모국어
                                    </label>
                                    <div className="relative">
                                        <motion.div
                                            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm text-white/80"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            한국어 (고정)
                                        </motion.div>
                                    </div>
                                </motion.div>

                                <motion.div className="mb-8" variants={itemVariants}>
                                    <label className="block text-lg font-semibold mb-3 text-purple-100">
                                        학습 언어
                                    </label>
                                    <div className="relative">
                                        <motion.div
                                            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm text-white/80"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            영어 (고정)
                                        </motion.div>
                                        <input
                                            type="hidden"
                                            name="targetLanguage"
                                            value="en"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        설정 저장
                                    </Button>
                                </motion.div>
                            </form>

                            <motion.div className="mt-6 text-center" variants={itemVariants}>
                                <Link
                                    href="/dashboard"
                                    className="text-purple-200 hover:text-purple-100 transition-colors duration-200"
                                >
                                    대시보드로 돌아가기
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}