

// "use client";

// import { Button } from "@/components/ui/button";
// import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
// import Link from "next/link";
// import { useEffect } from "react";
// import { motion } from "framer-motion";

// export default function LandingPage() {
//     const { isSignedIn, user } = useUser();

//     // Create user in database when they sign in
//     useEffect(() => {
//         const createUserInDatabase = async () => {
//             if (isSignedIn && user) {
//                 try {
//                     const response = await fetch('/api/user', {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({
//                             nativeLanguage: 'en', // Default or get from user preferences
//                             targetLanguage: 'es'  // Default or get from user preferences
//                         }),
//                     });

//                     const data = await response.json();
//                     console.log('User database creation result:', data);
//                 } catch (error) {
//                     console.error('Error creating user in database:', error);
//                 }
//             }
//         };

//         createUserInDatabase();
//     }, [isSignedIn, user]);

//     const containerVariants = {
//         hidden: { opacity: 0 },
//         visible: {
//             opacity: 1,
//             transition: {
//                 staggerChildren: 0.3,
//                 delayChildren: 0.2
//             }
//         }
//     };

//     const itemVariants = {
//         hidden: { y: 30, opacity: 0 },
//         visible: {
//             y: 0,
//             opacity: 1,
//             transition: {
//                 type: "spring",
//                 stiffness: 100,
//                 damping: 12
//             }
//         }
//     };

//     const headerVariants = {
//         hidden: { y: -50, opacity: 0 },
//         visible: {
//             y: 0,
//             opacity: 1,
//             transition: {
//                 type: "spring",
//                 stiffness: 120,
//                 damping: 15
//             }
//         }
//     };

//     const floatingVariants = {
//         animate: {
//             y: [-10, 10, -10],
//             transition: {
//                 duration: 6,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//             }
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white relative">
//             {/* Animated background elements */}
//             <div className="absolute inset-0 overflow-hidden">
//                 <motion.div
//                     className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"
//                     animate={{
//                         x: [0, 100, 0],
//                         y: [0, 50, 0],
//                         scale: [1, 1.2, 1]
//                     }}
//                     transition={{
//                         duration: 20,
//                         repeat: Infinity,
//                         ease: "linear"
//                     }}
//                 />
//                 <motion.div
//                     className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"
//                     animate={{
//                         x: [0, -100, 0],
//                         y: [0, -50, 0],
//                         scale: [1, 1.1, 1]
//                     }}
//                     transition={{
//                         duration: 15,
//                         repeat: Infinity,
//                         ease: "linear"
//                     }}
//                 />
//                 <motion.div
//                     className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20"
//                     animate={{
//                         rotate: [0, 360],
//                         scale: [1, 1.3, 1]
//                     }}
//                     transition={{
//                         duration: 25,
//                         repeat: Infinity,
//                         ease: "linear"
//                     }}
//                 />
//             </div>

//             <motion.header
//                 className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center backdrop-blur-sm bg-white/5 border-b border-white/10"
//                 variants={headerVariants}
//                 initial="hidden"
//                 animate="visible"
//             >
//                 <motion.h1
//                     className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent"
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ type: "spring", stiffness: 400, damping: 17 }}
//                 >
//                     Polyglot
//                 </motion.h1>
//                 <motion.div
//                     className="flex items-center space-x-6"
//                     variants={itemVariants}
//                 >
//                     {isSignedIn ? (
//                         <>
//                             <motion.span
//                                 className="text-lg bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent hidden sm:block"
//                                 initial={{ opacity: 0, x: 20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ delay: 0.5 }}
//                             >
//                                 Welcome, {user?.firstName}!
//                             </motion.span>
//                             <div className="flex items-center space-x-4">
//                                 <Link href="/dashboard">
//                                     <motion.div
//                                         whileHover={{ scale: 1.05 }}
//                                         whileTap={{ scale: 0.95 }}
//                                     >
//                                         <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200">
//                                             Dashboard
//                                         </Button>
//                                     </motion.div>
//                                 </Link>
//                                 <Link href="/settings">
//                                     <motion.div
//                                         whileHover={{ scale: 1.05 }}
//                                         whileTap={{ scale: 0.95 }}
//                                     >
//                                         <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200">
//                                             Settings
//                                         </Button>
//                                     </motion.div>
//                                 </Link>
//                                 <UserButton afterSignOutUrl="/" />
//                             </div>
//                         </>
//                     ) : (
//                         <>
//                             <SignInButton mode="modal">
//                                 <motion.div
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <Button
//                                         variant="outline"
//                                         className="bg-transparent border-2 border-purple-300 text-purple-200 hover:bg-purple-300 hover:text-purple-900 backdrop-blur-sm shadow-lg transition-all duration-200"
//                                     >
//                                         Sign In
//                                     </Button>
//                                 </motion.div>
//                             </SignInButton>
//                             <SignUpButton mode="modal">
//                                 <motion.div
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200">
//                                         Sign Up
//                                     </Button>
//                                 </motion.div>
//                             </SignUpButton>
//                         </>
//                     )}
//                 </motion.div>
//             </motion.header>

//             <motion.main
//                 className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-24 text-center px-4"
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="visible"
//             >
//                 <motion.h2
//                     className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent"
//                     variants={itemVariants}
//                 >
//                     Learn Languages with Ease
//                 </motion.h2>

//                 <motion.p
//                     className="text-xl mb-8 max-w-2xl text-purple-100 leading-relaxed"
//                     variants={itemVariants}
//                 >
//                     Master your chosen language through interactive lessons and quizzes focused on{" "}
//                     <span className="text-purple-200 font-semibold">Office</span>,{" "}
//                     <span className="text-purple-200 font-semibold">Kitchen</span>,{" "}
//                     <span className="text-purple-200 font-semibold">Garden</span>,{" "}
//                     <span className="text-purple-200 font-semibold">Cooking</span>,{" "}
//                     <span className="text-purple-200 font-semibold">Travel</span>,{" "}
//                     <span className="text-purple-200 font-semibold">Shopping</span>,{" "}
//                     <span className="text-purple-200 font-semibold">Daily Activities</span>, and{" "}
//                     <span className="text-purple-200 font-semibold">Workplace Phrases</span>. Start your journey with beginner and intermediate levels!
//                 </motion.p>

//                 <motion.div
//                     variants={itemVariants}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                 >
//                     {isSignedIn ? (
//                         <Link href="/dashboard">
//                             <Button className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white hover:from-purple-600 hover:via-indigo-600 hover:to-purple-700 text-lg px-8 py-3 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1">
//                                 Continue Learning
//                             </Button>
//                         </Link>
//                     ) : (
//                         <SignInButton mode="modal">
//                             <Button className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white hover:from-purple-600 hover:via-indigo-600 hover:to-purple-700 text-lg px-8 py-3 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1">
//                                 Get Started
//                             </Button>
//                         </SignInButton>
//                     )}
//                 </motion.div>

//                 {/* Feature highlights */}
//                 <motion.div
//                     className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl"
//                     variants={containerVariants}
//                 >
//                     {[
//                         { icon: "🎯", title: "Interactive Lessons", desc: "Engaging activities for every learning style" },
//                         { icon: "🏆", title: "Track Progress", desc: "Monitor your advancement with detailed analytics" },
//                         { icon: "🌍", title: "Real-World Phrases", desc: "Learn practical language for everyday situations" }
//                     ].map((feature, index) => (
//                         <motion.div
//                             key={index}
//                             className="backdrop-blur-sm bg-white/10 p-6 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
//                             variants={itemVariants}
//                             whileHover={{ scale: 1.05, y: -5 }}
//                         >
//                             <div className="text-3xl mb-3">{feature.icon}</div>
//                             <h3 className="text-lg font-semibold mb-2 text-purple-200">{feature.title}</h3>
//                             <p className="text-purple-100 text-sm">{feature.desc}</p>
//                         </motion.div>
//                     ))}
//                 </motion.div>
//             </motion.main>
//         </div>
//     );
// }


// Landingpage.jsx
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function LandingPage() {
    const { isSignedIn, user } = useUser();

    useEffect(() => {
        const createUserInDatabase = async () => {
            if (isSignedIn && user) {
                try {
                    const response = await fetch("/api/user", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            nativeLanguage: "ko",
                            targetLanguage: "en",
                        }),
                    });
                    const data = await response.json();
                    console.log("User database creation result:", data);
                } catch (error) {
                    console.error("Error creating user in database:", error);
                }
            }
        };
        createUserInDatabase();
    }, [isSignedIn, user]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
    };

    const headerVariants = {
        hidden: { y: -50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 15,
            },
        },
    };

    const Button = ({ children, className, onClick, variant, ...props }) => (
        <button
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${variant === "outline" ? "bg-transparent border-2" : ""
                } ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white relative">
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20"
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>

            <motion.header
                className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center backdrop-blur-sm bg-white/5 border-b border-white/10"
                variants={headerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    잉글리시 플러스
                </motion.h1>
                <motion.div className="flex items-center space-x-6" variants={itemVariants}>
                    {isSignedIn ? (
                        <>
                            <motion.span
                                className="text-lg bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent hidden sm:block"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                환영합니다, {user?.firstName}님!
                            </motion.span>
                            <div className="flex items-center space-x-4">
                                <Link href="/dashboard">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200">
                                            대시보드
                                        </Button>
                                    </motion.div>
                                </Link>
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </>
                    ) : (
                        <>
                            <SignInButton mode="modal">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="outline"
                                        className="bg-transparent border-2 border-purple-300 text-purple-200 hover:bg-purple-300 hover:text-purple-900 backdrop-blur-sm shadow-lg transition-all duration-200"
                                    >
                                        로그인
                                    </Button>
                                </motion.div>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200">
                                        회원가입
                                    </Button>
                                </motion.div>
                            </SignUpButton>
                        </>
                    )}
                </motion.div>
            </motion.header>

            <motion.main
                className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-24 text-center px-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex items-center justify-center gap-6 mb-6">
                    <motion.div
                        className="text-4xl md:text-5xl text-purple-200"
                        animate={{ rotate: [0, 360] }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        ✨
                    </motion.div>
                    <motion.h2
                        className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent pb-2"
                        variants={itemVariants}
                    >
                        영어를 쉽게 배우세요
                    </motion.h2>
                    <motion.div
                        className="text-4xl md:text-5xl text-purple-200"
                        animate={{ rotate: [360, 0] }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        ✨
                    </motion.div>
                </div>

                <motion.p
                    className="text-xl mb-8 max-w-2xl text-purple-100 leading-relaxed"
                    variants={itemVariants}
                >
                    <span className="text-purple-200 font-semibold">사무실</span>,{" "}
                    <span className="text-purple-200 font-semibold">주방</span>,{" "}
                    <span className="text-purple-200 font-semibold">정원</span>,{" "}
                    <span className="text-purple-200 font-semibold">요리</span>,{" "}
                    <span className="text-purple-200 font-semibold">여행</span>,{" "}
                    <span className="text-purple-200 font-semibold">쇼핑</span>,{" "}
                    <span className="text-purple-200 font-semibold">일상 활동</span>,{" "}
                    <span className="text-purple-200 font-semibold">직장 용어</span>,{" "}
                    <span className="text-purple-200 font-semibold">학교</span>,{" "}
                    <span className="text-purple-200 font-semibold">건강</span>,{" "}
                    <span className="text-purple-200 font-semibold">기술</span>,{" "}
                    <span className="text-purple-200 font-semibold">비즈니스</span>,{" "}
                    <span className="text-purple-200 font-semibold">교육</span>{" "}
                    주제의 대화형 레슨과 퀴즈를 통해 영어를 마스터하세요. 초급, 중급, 고급 레벨로 학습 여정을 시작하세요!
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isSignedIn ? (
                        <Link href="/dashboard">
                            <Button className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white hover:from-purple-600 hover:via-indigo-600 hover:to-purple-700 text-lg px-8 py-3 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1">
                                학습 계속하기
                            </Button>
                        </Link>
                    ) : (
                        <SignUpButton mode="modal">
                            <Button className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white hover:from-purple-600 hover:via-indigo-600 hover:to-purple-700 text-lg px-8 py-3 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1">
                                시작하기
                            </Button>
                        </SignUpButton>
                    )}
                </motion.div>

                <motion.div
                    className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl"
                    variants={containerVariants}
                >
                    {[
                        { icon: "🎯", title: "대화형 레슨", desc: "모든 학습 스타일에 맞는 흥미로운 활동" },
                        { icon: "🏆", title: "진도 추적", desc: "상세한 분석으로 학습 진척도를 확인" },
                        { icon: "🌍", title: "실생활 표현", desc: "일상 상황에 맞는 실용적인 영어 학습" },
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            className="backdrop-blur-sm bg-white/10 p-6 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, y: -5 }}
                        >
                            <div className="text-3xl mb-3">{feature.icon}</div>
                            <h3 className="text-lg font-semibold mb-2 text-purple-200">{feature.title}</h3>
                            <p className="text-purple-100 text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.main>
        </div>
    );
}