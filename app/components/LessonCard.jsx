// "use client";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useState } from "react";
// import ReactCardFlip from "react-card-flip";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";

// const WordCard = ({ word, index }) => {
//     const [isFlipped, setIsFlipped] = useState(false);

//     const speakWord = (wordText, speechLang) => {
//         if ("speechSynthesis" in window) {
//             const utterance = new SpeechSynthesisUtterance(wordText);
//             utterance.lang = speechLang;
//             window.speechSynthesis.speak(utterance);
//         }
//     };

//     return (
//         <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" key={index}>
//             <div className="h-48 w-full cursor-pointer bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl p-6 flex flex-col justify-between text-white shadow-xl">
//                 <div className="text-center">
//                     <h4 className="text-2xl font-bold mb-2">{word.word}</h4>
//                     <p className="text-purple-100 text-sm">/{word.pronunciation}/</p>
//                 </div>
//                 <div className="flex justify-center">
//                     <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             speakWord(word.word, word.speechLang);
//                         }}
//                         className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full transition-all duration-200"
//                     >
//                         🔊 Listen
//                     </motion.button>
//                 </div>
//                 <div className="text-center text-xs text-purple-100 opacity-75" onClick={() => setIsFlipped(true)}>
//                     Click to see translation
//                 </div>
//             </div>
//             <div className="h-48 w-full cursor-pointer bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl p-6 flex flex-col justify-center text-white shadow-xl" onClick={() => setIsFlipped(false)}>
//                 <div className="text-center">
//                     <h4 className="text-2xl font-bold mb-4">{word.translation}</h4>
//                     <p className="text-emerald-100 text-sm mb-4">Translation of</p>
//                     <p className="text-lg font-semibold">{word.word}</p>
//                 </div>
//                 <div className="text-center text-xs text-emerald-100 opacity-75 mt-4">
//                     Click to flip back
//                 </div>
//             </div>
//         </ReactCardFlip>
//     );
// };

// export default function LessonCard({ lesson, languageCode, nativeLanguage, targetLanguage }) {
//     const [words, setWords] = useState([]);
//     const [translationQuiz, setTranslationQuiz] = useState([]);
//     const [fillInTheBlankQuiz, setFillInTheBlankQuiz] = useState([]);
//     const [speechLang, setSpeechLang] = useState("en-US");
//     const [showQuiz, setShowQuiz] = useState(false);
//     const [quizType, setQuizType] = useState("");
//     const [quizAnswers, setQuizAnswers] = useState({});
//     const [quizSubmitted, setQuizSubmitted] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [lessonCompleted, setLessonCompleted] = useState(false);
//     const [currentWordIndex, setCurrentWordIndex] = useState(0);

//     if (!lesson || !lesson.id || !lesson.lesson_name || !lesson.context) {
//         return (
//             <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-12 text-red-600"
//             >
//                 Error: Invalid lesson data provided.
//             </motion.div>
//         );
//     }

//     const fetchLessonContent = async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             const response = await axios.post("/api/lessons", {
//                 lessonId: lesson.id,
//                 languageCode,
//                 context: lesson.context,
//                 nativeLanguage,
//             });
//             if (!response.data.content) throw new Error("No content returned from API");
//             const { words, translationQuiz, fillInTheBlankQuiz, speechLang } = response.data.content;
//             setWords(words.map(word => ({ ...word, speechLang })) || []);
//             setTranslationQuiz(translationQuiz || []);
//             setFillInTheBlankQuiz(fillInTheBlankQuiz || []);
//             setSpeechLang(speechLang);
//         } catch (error) {
//             console.error("Error fetching lesson content:", error);
//             setError("Failed to load lesson content. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleQuizAnswer = (questionIndex, answer) => {
//         setQuizAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
//     };

//     const submitQuiz = async () => {
//         try {
//             const currentQuiz = quizType === "translation" ? translationQuiz : fillInTheBlankQuiz;
//             if (!currentQuiz.length) {
//                 setError("No quiz questions available for this section.");
//                 return;
//             }
//             const correct = currentQuiz.every((q, i) => quizAnswers[i] === q.correctAnswer);
//             setQuizSubmitted(true);
//             if (quizType === "translation") {
//                 if (!correct) {
//                     setError("Some answers were incorrect. Please review and try again.");
//                 } else {
//                     setError(null);
//                 }
//             } else if (correct) {
//                 setLessonCompleted(true);
//                 await axios.post("/api/progress", { lessonId: lesson.id, completed: true });
//                 setTimeout(() => window.location.reload(), 2000);
//             } else {
//                 setError("Some answers were incorrect. Please review and try again.");
//             }
//         } catch (error) {
//             console.error("Error submitting quiz:", error);
//             setError("Failed to submit quiz. Please try again.");
//         }
//     };

//     const resetQuiz = () => {
//         setQuizAnswers({});
//         setQuizSubmitted(false);
//         setError(null);
//     };

//     const proceedToNextQuiz = () => {
//         if (quizType === "translation" && quizSubmitted) {
//             setQuizType("fillInTheBlank");
//             setQuizAnswers({});
//             setQuizSubmitted(false);
//             setError(null);
//         }
//     };

//     const resetLesson = () => {
//         setWords([]);
//         setTranslationQuiz([]);
//         setFillInTheBlankQuiz([]);
//         setShowQuiz(false);
//         setQuizType("");
//         setQuizAnswers({});
//         setQuizSubmitted(false);
//         setError(null);
//         setLessonCompleted(false);
//         setCurrentWordIndex(0);
//         fetchLessonContent();
//     };

//     const returnToWords = () => {
//         setShowQuiz(false);
//         setQuizType("");
//         setQuizAnswers({});
//         setQuizSubmitted(false);
//         setError(null);
//     };

//     return (
//         <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//         >
//             <Card className="bg-white shadow-2xl border-0 overflow-hidden">
//                 <motion.div
//                     initial={{ y: -50 }}
//                     animate={{ y: 0 }}
//                     transition={{ type: "spring", stiffness: 100 }}
//                 >
//                     <CardHeader className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white relative overflow-hidden">
//                         <motion.div
//                             className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-30"
//                             animate={{ x: [-1000, 1000] }}
//                             transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
//                         />
//                         <CardTitle className="relative z-10 text-2xl font-bold">{lesson.lesson_name}</CardTitle>
//                     </CardHeader>
//                 </motion.div>
//                 <CardContent className="p-8">
//                     <AnimatePresence mode="wait">
//                         {error && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: -20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -20 }}
//                                 className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-sm"
//                             >
//                                 {error}
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                     {loading ? (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             className="text-center py-12"
//                         >
//                             <motion.div
//                                 animate={{ rotate: 360 }}
//                                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                                 className="rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"
//                             />
//                             <motion.p
//                                 animate={{ opacity: [0.5, 1, 0.5] }}
//                                 transition={{ duration: 1.5, repeat: Infinity }}
//                                 className="text-lg text-gray-600"
//                             >
//                                 Loading lesson content...
//                             </motion.p>
//                         </motion.div>
//                     ) : lessonCompleted ? (
//                         <motion.div
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             className="text-center py-12"
//                         >
//                             <motion.h3
//                                 initial={{ opacity: 0, y: -20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
//                             >
//                                 🎉 Lesson Completed!
//                             </motion.h3>
//                             <p className="text-lg text-gray-600 mb-4">
//                                 Great job! You've mastered this lesson.
//                             </p>
//                             <motion.p
//                                 animate={{ opacity: [0.5, 1, 0.5] }}
//                                 transition={{ duration: 1.5, repeat: Infinity }}
//                                 className="text-sm text-gray-500"
//                             >
//                                 Returning to dashboard...
//                             </motion.p>
//                             <Button
//                                 onClick={resetLesson}
//                                 className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full"
//                             >
//                                 Restart Lesson
//                             </Button>
//                         </motion.div>
//                     ) : !words.length && !showQuiz ? (
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             className="text-center py-12"
//                         >
//                             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                 <Button
//                                     onClick={fetchLessonContent}
//                                     className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                     disabled={loading}
//                                 >
//                                     ✨ Start Lesson
//                                 </Button>
//                             </motion.div>
//                         </motion.div>
//                     ) : !showQuiz || quizType === "" ? (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             className="space-y-8"
//                         >
//                             <motion.h3
//                                 initial={{ opacity: 0, y: -20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
//                             >
//                                 📚 Learn These Words
//                             </motion.h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {words.length ? (
//                                     words.map((word, index) => (
//                                         <WordCard key={index} word={word} index={index} />
//                                     ))
//                                 ) : (
//                                     <p className="text-center text-gray-600">No words available for this lesson.</p>
//                                 )}
//                             </div>
//                             <motion.div
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: 0.5 }}
//                                 className="text-center pt-8"
//                             >
//                                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                     <Button
//                                         onClick={() => {
//                                             setShowQuiz(true);
//                                             setQuizType("translation");
//                                         }}
//                                         className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                         disabled={!words.length}
//                                     >
//                                         🎯 Take Translation Quiz
//                                     </Button>
//                                 </motion.div>
//                             </motion.div>
//                         </motion.div>
//                     ) : (
//                         <motion.div
//                             initial={{ opacity: 0, x: 50 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             className="space-y-8"
//                         >
//                             <motion.h3
//                                 initial={{ opacity: 0, y: -20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
//                             >
//                                 {quizType === "translation" ? "🎯 Translation Quiz" : "🎯 Fill-in-the-Blank Quiz"}
//                             </motion.h3>
//                             {(quizType === "translation" ? translationQuiz : fillInTheBlankQuiz).length ? (
//                                 (quizType === "translation" ? translationQuiz : fillInTheBlankQuiz).map((q, i) => (
//                                     <motion.div
//                                         key={i}
//                                         initial={{ opacity: 0, y: 20 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         transition={{ delay: i * 0.1 }}
//                                         className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 shadow-lg border border-gray-200"
//                                     >
//                                         <p className="font-semibold text-lg mb-4 text-gray-800">{q.question}</p>
//                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                                             {q.options.map((option, j) => (
//                                                 <motion.div
//                                                     key={j}
//                                                     whileHover={{ scale: 1.02 }}
//                                                     whileTap={{ scale: 0.98 }}
//                                                 >
//                                                     <Button
//                                                         onClick={() => handleQuizAnswer(i, option)}
//                                                         disabled={quizSubmitted}
//                                                         variant={quizAnswers[i] === option ? "default" : "outline"}
//                                                         className={`w-full py-3 transition-all duration-200 ${quizAnswers[i] === option
//                                                                 ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
//                                                                 : "hover:bg-gray-50 hover:border-purple-300"
//                                                             }`}
//                                                     >
//                                                         {option}
//                                                     </Button>
//                                                 </motion.div>
//                                             ))}
//                                         </div>
//                                         <AnimatePresence>
//                                             {quizSubmitted && (
//                                                 <motion.p
//                                                     initial={{ opacity: 0, y: 10 }}
//                                                     animate={{ opacity: 1, y: 0 }}
//                                                     className={`mt-4 font-medium text-center ${quizAnswers[i] === q.correctAnswer ? "text-green-600" : "text-red-600"
//                                                         }`}
//                                                 >
//                                                     {quizAnswers[i] === q.correctAnswer
//                                                         ? "✓ Correct!"
//                                                         : `✗ Incorrect. Correct answer: ${q.correctAnswer}`}
//                                                 </motion.p>
//                                             )}
//                                         </AnimatePresence>
//                                     </motion.div>
//                                 ))
//                             ) : (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     className="text-center py-8"
//                                 >
//                                     <p className="text-center text-gray-600 mb-4">
//                                         No quiz questions available for this section.
//                                     </p>
//                                     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                         <Button
//                                             onClick={returnToWords}
//                                             className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                         >
//                                             🔙 Back to Words
//                                         </Button>
//                                     </motion.div>
//                                 </motion.div>
//                             )}
//                             {(quizType === "translation" ? translationQuiz : fillInTheBlankQuiz).length > 0 && (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     className="text-center pt-4"
//                                 >
//                                     <AnimatePresence mode="wait">
//                                         {!quizSubmitted ? (
//                                             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                                 <Button
//                                                     onClick={submitQuiz}
//                                                     className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                                     disabled={
//                                                         Object.keys(quizAnswers).length <
//                                                         (quizType === "translation" ? translationQuiz.length : fillInTheBlankQuiz.length)
//                                                     }
//                                                 >
//                                                     📝 Submit Quiz
//                                                 </Button>
//                                             </motion.div>
//                                         ) : quizType === "translation" ? (
//                                             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                                 <Button
//                                                     onClick={proceedToNextQuiz}
//                                                     className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                                 >
//                                                     🎯 Next Quiz (Fill-in-the-Blank)
//                                                 </Button>
//                                             </motion.div>
//                                         ) : (
//                                             <motion.div
//                                                 initial={{ opacity: 0, scale: 0.9 }}
//                                                 animate={{ opacity: 1, scale: 1 }}
//                                                 whileHover={{ scale: 1.05 }}
//                                                 whileTap={{ scale: 0.95 }}
//                                             >
//                                                 <Button
//                                                     onClick={resetQuiz}
//                                                     className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                                 >
//                                                     🔄 Try Again
//                                                 </Button>
//                                             </motion.div>
//                                         )}
//                                     </AnimatePresence>
//                                 </motion.div>
//                             )}
//                         </motion.div>
//                     )}
//                 </CardContent>
//             </Card>
//         </motion.div>
//     );
// }


// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useState } from "react";
// import ReactCardFlip from "react-card-flip";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";

// const WordCard = ({ word, index }) => {
//     const [isFlipped, setIsFlipped] = useState(false);

//     const speakWord = (wordText, speechLang) => {
//         if ("speechSynthesis" in window) {
//             const utterance = new SpeechSynthesisUtterance(wordText);
//             utterance.lang = speechLang;
//             window.speechSynthesis.speak(utterance);
//         }
//     };

//     return (
//         <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" key={index}>
//             <div className="h-48 w-full cursor-pointer bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl p-6 flex flex-col justify-between text-white shadow-xl">
//                 <div className="text-center">
//                     <h4 className="text-2xl font-bold mb-2">{word.word}</h4>
//                     <p className="text-purple-100 text-sm">/{word.pronunciation}/</p>
//                 </div>
//                 <div className="flex justify-center">
//                     <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             speakWord(word.word, word.speechLang);
//                         }}
//                         className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full transition-all duration-200"
//                     >
//                         🔊 Listen
//                     </motion.button>
//                 </div>
//                 <div className="text-center text-xs text-purple-100 opacity-75" onClick={() => setIsFlipped(true)}>
//                     Click to see translation
//                 </div>
//             </div>
//             <div className="h-48 w-full cursor-pointer bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl p-6 flex flex-col justify-center text-white shadow-xl" onClick={() => setIsFlipped(false)}>
//                 <div className="text-center">
//                     <h4 className="text-2xl font-bold mb-4">{word.translation}</h4>
//                     <p className="text-emerald-100 text-sm mb-4">Translation of</p>
//                     <p className="text-lg font-semibold">{word.word}</p>
//                 </div>
//                 <div className="text-center text-xs text-emerald-100 opacity-75 mt-4">
//                     Click to flip back
//                 </div>
//             </div>
//         </ReactCardFlip>
//     );
// };

// export default function LessonCard({ lesson, languageCode, nativeLanguage, targetLanguage }) {
//     const [words, setWords] = useState([]);
//     const [translationQuiz, setTranslationQuiz] = useState([]);
//     const [fillInTheBlankQuiz, setFillInTheBlankQuiz] = useState([]);
//     const [speechLang, setSpeechLang] = useState("en-US");
//     const [showQuiz, setShowQuiz] = useState(false);
//     const [quizType, setQuizType] = useState("");
//     const [quizAnswers, setQuizAnswers] = useState({});
//     const [quizSubmitted, setQuizSubmitted] = useState(false);
//     const [quizResults, setQuizResults] = useState({ translation: { correct: 0, incorrect: 0 }, fillInTheBlank: { correct: 0, incorrect: 0 } });
//     const [showReportCard, setShowReportCard] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [lessonCompleted, setLessonCompleted] = useState(false);
//     const [currentWordIndex, setCurrentWordIndex] = useState(0);

//     if (!lesson || !lesson.id || !lesson.lesson_name || !lesson.context) {
//         return (
//             <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-12 text-red-600"
//             >
//                 Error: Invalid lesson data provided.
//             </motion.div>
//         );
//     }

//     const fetchLessonContent = async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             const response = await axios.post("/api/lessons", {
//                 lessonId: lesson.id,
//                 languageCode,
//                 context: lesson.context,
//                 nativeLanguage,
//             });
//             if (!response.data.content) throw new Error("No content returned from API");
//             const { words, translationQuiz, fillInTheBlankQuiz, speechLang } = response.data.content;
//             setWords(words.map(word => ({ ...word, speechLang })) || []);
//             setTranslationQuiz(translationQuiz || []);
//             setFillInTheBlankQuiz(fillInTheBlankQuiz || []);
//             setSpeechLang(speechLang);
//         } catch (error) {
//             console.error("Error fetching lesson content:", error);
//             setError("Failed to load lesson content. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleQuizAnswer = (questionIndex, answer) => {
//         setQuizAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
//     };

//     const submitQuiz = async () => {
//         try {
//             const currentQuiz = quizType === "translation" ? translationQuiz : fillInTheBlankQuiz;
//             if (!currentQuiz.length) {
//                 setError("No quiz questions available for this section.");
//                 return;
//             }
//             const results = currentQuiz.reduce(
//                 (acc, q, i) => {
//                     const isCorrect = quizAnswers[i] === q.correctAnswer;
//                     return {
//                         correct: acc.correct + (isCorrect ? 1 : 0),
//                         incorrect: acc.incorrect + (isCorrect ? 0 : 1),
//                     };
//                 },
//                 { correct: 0, incorrect: 0 }
//             );
//             setQuizResults((prev) => ({
//                 ...prev,
//                 [quizType]: results,
//             }));
//             const correct = currentQuiz.every((q, i) => quizAnswers[i] === q.correctAnswer);
//             setQuizSubmitted(true);
//             if (quizType === "translation") {
//                 if (!correct) {
//                     setError("Some answers were incorrect. Please review and try again.");
//                 } else {
//                     setError(null);
//                 }
//             } else {
//                 setShowReportCard(true); // Show report card after fill-in-the-blank quiz
//                 if (correct) {
//                     setLessonCompleted(true);
//                     await axios.post("/api/progress", { lessonId: lesson.id, completed: true });
//                     setTimeout(() => window.location.reload(), 2000);
//                 } else {
//                     setError("Some answers were incorrect. Please review and try again.");
//                 }
//             }
//         } catch (error) {
//             console.error("Error submitting quiz:", error);
//             setError("Failed to submit quiz. Please try again.");
//         }
//     };

//     const resetQuiz = () => {
//         setQuizAnswers({});
//         setQuizSubmitted(false);
//         setShowReportCard(false);
//         setError(null);
//     };

//     const proceedToNextQuiz = () => {
//         if (quizType === "translation" && quizSubmitted) {
//             setQuizType("fillInTheBlank");
//             setQuizAnswers({});
//             setQuizSubmitted(false);
//             setError(null);
//         }
//     };

//     const resetLesson = () => {
//         setWords([]);
//         setTranslationQuiz([]);
//         setFillInTheBlankQuiz([]);
//         setShowQuiz(false);
//         setQuizType("");
//         setQuizAnswers({});
//         setQuizSubmitted(false);
//         setQuizResults({ translation: { correct: 0, incorrect: 0 }, fillInTheBlank: { correct: 0, incorrect: 0 } });
//         setShowReportCard(false);
//         setError(null);
//         setLessonCompleted(false);
//         setCurrentWordIndex(0);
//         fetchLessonContent();
//     };

//     const returnToWords = () => {
//         setShowQuiz(false);
//         setQuizType("");
//         setQuizAnswers({});
//         setQuizSubmitted(false);
//         setShowReportCard(false);
//         setError(null);
//     };

//     return (
//         <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//         >
//             <Card className="bg-white shadow-2xl border-0 overflow-hidden">
//                 <motion.div
//                     initial={{ y: -50 }}
//                     animate={{ y: 0 }}
//                     transition={{ type: "spring", stiffness: 100 }}
//                 >
//                     <CardHeader className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white relative overflow-hidden">
//                         <motion.div
//                             className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-30"
//                             animate={{ x: [-1000, 1000] }}
//                             transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
//                         />
//                         <CardTitle className="relative z-10 text-2xl font-bold">{lesson.lesson_name}</CardTitle>
//                     </CardHeader>
//                 </motion.div>
//                 <CardContent className="p-8">
//                     <AnimatePresence mode="wait">
//                         {error && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: -20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -20 }}
//                                 className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-sm"
//                             >
//                                 {error}
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                     {loading ? (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             className="text-center py-12"
//                         >
//                             <motion.div
//                                 animate={{ rotate: 360 }}
//                                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                                 className="rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"
//                             />
//                             <motion.p
//                                 animate={{ opacity: [0.5, 1, 0.5] }}
//                                 transition={{ duration: 1.5, repeat: Infinity }}
//                                 className="text-lg text-gray-600"
//                             >
//                                 Loading lesson content...
//                             </motion.p>
//                         </motion.div>
//                     ) : lessonCompleted && !showReportCard ? (
//                         <motion.div
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             className="text-center py-12"
//                         >
//                             <motion.h3
//                                 initial={{ opacity: 0, y: -20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
//                             >
//                                 🎉 Lesson Completed!
//                             </motion.h3>
//                             <p className="text-lg text-gray-600 mb-4">
//                                 Great job! You've mastered this lesson.
//                             </p>
//                             <motion.p
//                                 animate={{ opacity: [0.5, 1, 0.5] }}
//                                 transition={{ duration: 1.5, repeat: Infinity }}
//                                 className="text-sm text-gray-500"
//                             >
//                                 Returning to dashboard...
//                             </motion.p>
//                             <Button
//                                 onClick={resetLesson}
//                                 className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full"
//                             >
//                                 Restart Lesson
//                             </Button>
//                         </motion.div>
//                     ) : showReportCard ? (
//                         <motion.div
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             className="text-center py-12"
//                         >
//                             <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
//                                 📊 Quiz Report Card
//                             </h3>
//                             <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 max-w-md mx-auto">
//                                 <h4 className="text-xl font-semibold mb-4">Translation Quiz</h4>
//                                 <p className="text-gray-600 mb-2">
//                                     Correct: <span className="text-green-600">{quizResults.translation.correct}</span>
//                                 </p>
//                                 <p className="text-gray-600 mb-4">
//                                     Incorrect: <span className="text-red-600">{quizResults.translation.incorrect}</span>
//                                 </p>
//                                 <h4 className="text-xl font-semibold mb-4">Fill-in-the-Blank Quiz</h4>
//                                 <p className="text-gray-600 mb-2">
//                                     Correct: <span className="text-green-600">{quizResults.fillInTheBlank.correct}</span>
//                                 </p>
//                                 <p className="text-gray-600 mb-4">
//                                     Incorrect: <span className="text-red-600">{quizResults.fillInTheBlank.incorrect}</span>
//                                 </p>
//                                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                     <Button
//                                         onClick={resetQuiz}
//                                         className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                     >
//                                         🔄 Try Again
//                                     </Button>
//                                 </motion.div>
//                             </div>
//                         </motion.div>
//                     ) : !words.length && !showQuiz ? (
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             className="text-center py-12"
//                         >
//                             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                 <Button
//                                     onClick={fetchLessonContent}
//                                     className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                     disabled={loading}
//                                 >
//                                     ✨ Start Lesson
//                                 </Button>
//                             </motion.div>
//                         </motion.div>
//                     ) : !showQuiz || quizType === "" ? (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             className="space-y-8"
//                         >
//                             <motion.h3
//                                 initial={{ opacity: 0, y: -20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
//                             >
//                                 📚 Learn These Words
//                             </motion.h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {words.length ? (
//                                     words.map((word, index) => (
//                                         <WordCard key={index} word={word} index={index} />
//                                     ))
//                                 ) : (
//                                     <p className="text-center text-gray-600">No words available for this lesson.</p>
//                                 )}
//                             </div>
//                             <motion.div
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: 0.5 }}
//                                 className="text-center pt-8"
//                             >
//                                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                     <Button
//                                         onClick={() => {
//                                             setShowQuiz(true);
//                                             setQuizType("translation");
//                                         }}
//                                         className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                         disabled={!words.length}
//                                     >
//                                         🎯 Take Translation Quiz
//                                     </Button>
//                                 </motion.div>
//                             </motion.div>
//                         </motion.div>
//                     ) : (
//                         <motion.div
//                             initial={{ opacity: 0, x: 50 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             className="space-y-8"
//                         >
//                             <motion.h3
//                                 initial={{ opacity: 0, y: -20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
//                             >
//                                 {quizType === "translation" ? "🎯 Translation Quiz" : "🎯 Fill-in-the-Blank Quiz"}
//                             </motion.h3>
//                             {(quizType === "translation" ? translationQuiz : fillInTheBlankQuiz).length ? (
//                                 (quizType === "translation" ? translationQuiz : fillInTheBlankQuiz).map((q, i) => (
//                                     <motion.div
//                                         key={i}
//                                         initial={{ opacity: 0, y: 20 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         transition={{ delay: i * 0.1 }}
//                                         className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 shadow-lg border border-gray-200"
//                                     >
//                                         <p className="font-semibold text-lg mb-4 text-gray-800">{q.question}</p>
//                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                                             {q.options.map((option, j) => (
//                                                 <motion.div
//                                                     key={j}
//                                                     whileHover={{ scale: 1.02 }}
//                                                     whileTap={{ scale: 0.98 }}
//                                                 >
//                                                     <Button
//                                                         onClick={() => handleQuizAnswer(i, option)}
//                                                         disabled={quizSubmitted}
//                                                         variant={quizAnswers[i] === option ? "default" : "outline"}
//                                                         className={`w-full py-3 transition-all duration-200 ${quizAnswers[i] === option
//                                                                 ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
//                                                                 : "hover:bg-gray-50 hover:border-purple-300"
//                                                             }`}
//                                                     >
//                                                         {option}
//                                                     </Button>
//                                                 </motion.div>
//                                             ))}
//                                         </div>
//                                         <AnimatePresence>
//                                             {quizSubmitted && (
//                                                 <motion.p
//                                                     initial={{ opacity: 0, y: 10 }}
//                                                     animate={{ opacity: 1, y: 0 }}
//                                                     className={`mt-4 font-medium text-center ${quizAnswers[i] === q.correctAnswer ? "text-green-600" : "text-red-600"
//                                                         }`}
//                                                 >
//                                                     {quizAnswers[i] === q.correctAnswer
//                                                         ? "✓ Correct!"
//                                                         : `✗ Incorrect. Correct answer: ${q.correctAnswer}`}
//                                                 </motion.p>
//                                             )}
//                                         </AnimatePresence>
//                                     </motion.div>
//                                 ))
//                             ) : (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     className="text-center py-8"
//                                 >
//                                     <p className="text-center text-gray-600 mb-4">
//                                         No quiz questions available for this section.
//                                     </p>
//                                     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                         <Button
//                                             onClick={returnToWords}
//                                             className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                         >
//                                             🔙 Back to Words
//                                         </Button>
//                                     </motion.div>
//                                 </motion.div>
//                             )}
//                             {(quizType === "translation" ? translationQuiz : fillInTheBlankQuiz).length > 0 && (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     className="text-center pt-4"
//                                 >
//                                     <AnimatePresence mode="wait">
//                                         {!quizSubmitted ? (
//                                             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                                 <Button
//                                                     onClick={submitQuiz}
//                                                     className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                                     disabled={
//                                                         Object.keys(quizAnswers).length <
//                                                         (quizType === "translation" ? translationQuiz.length : fillInTheBlankQuiz.length)
//                                                     }
//                                                 >
//                                                     📝 Submit Quiz
//                                                 </Button>
//                                             </motion.div>
//                                         ) : quizType === "translation" ? (
//                                             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                                 <Button
//                                                     onClick={proceedToNextQuiz}
//                                                     className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                                 >
//                                                     🎯 Next Quiz (Fill-in-the-Blank)
//                                                 </Button>
//                                             </motion.div>
//                                         ) : (
//                                             <motion.div
//                                                 initial={{ opacity: 0, scale: 0.9 }}
//                                                 animate={{ opacity: 1, scale: 1 }}
//                                                 whileHover={{ scale: 1.05 }}
//                                                 whileTap={{ scale: 0.95 }}
//                                             >
//                                                 <Button
//                                                     onClick={resetQuiz}
//                                                     className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                                 >
//                                                     🔄 Try Again
//                                                 </Button>
//                                             </motion.div>
//                                         )}
//                                     </AnimatePresence>
//                                 </motion.div>
//                             )}
//                         </motion.div>
//                     )}
//                 </CardContent>
//             </Card>
//         </motion.div>
//     );
// }




// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useState } from "react";
// import ReactCardFlip from "react-card-flip";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import confetti from "canvas-confetti";
// import { saveProgress } from "@/app/actions/saveProgress";

// const WordCard = ({ word, index }) => {
//     const [isFlipped, setIsFlipped] = useState(false);

//     const speakWord = (wordText, speechLang) => {
//         if ("speechSynthesis" in window) {
//             const utterance = new SpeechSynthesisUtterance(wordText);
//             utterance.lang = speechLang;
//             window.speechSynthesis.speak(utterance);
//         }
//     };

//     return (
//         <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" key={index}>
//             <div className="h-48 w-full cursor-pointer bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl p-6 flex flex-col justify-between text-white shadow-xl">
//                 <div className="text-center">
//                     <h4 className="text-2xl font-bold mb-2">{word.word}</h4>
//                     <p className="text-purple-100 text-sm">/{word.pronunciation}/</p>
//                 </div>
//                 <div className="flex justify-center">
//                     <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             speakWord(word.word, word.speechLang);
//                         }}
//                         className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full transition-all duration-200"
//                     >
//                         🔊 Listen
//                     </motion.button>
//                 </div>
//                 <div className="text-center text-xs text-purple-100 opacity-75" onClick={() => setIsFlipped(true)}>
//                     Click to see translation
//                 </div>
//             </div>
//             <div className="h-48 w-full cursor-pointer bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl p-6 flex flex-col justify-center text-white shadow-xl" onClick={() => setIsFlipped(false)}>
//                 <div className="text-center">
//                     <h4 className="text-2xl font-bold mb-4">{word.translation}</h4>
//                     <p className="text-emerald-100 text-sm mb-4">Translation of</p>
//                     <p className="text-lg font-semibold">{word.word}</p>
//                 </div>
//                 <div className="text-center text-xs text-emerald-100 opacity-75 mt-4">
//                     Click to flip back
//                 </div>
//             </div>
//         </ReactCardFlip>
//     );
// };

// export default function LessonCard({ lesson, languageCode, nativeLanguage, targetLanguage }) {
//     const [words, setWords] = useState([]);
//     const [translationQuiz, setTranslationQuiz] = useState([]);
//     const [fillInTheBlankQuiz, setFillInTheBlankQuiz] = useState([]);
//     const [speechLang, setSpeechLang] = useState("en-US");
//     const [showQuiz, setShowQuiz] = useState(false);
//     const [quizType, setQuizType] = useState("");
//     const [quizAnswers, setQuizAnswers] = useState({});
//     const [quizSubmitted, setQuizSubmitted] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [lessonCompleted, setLessonCompleted] = useState(false);
//     const [showReportCard, setShowReportCard] = useState(false);

//     if (!lesson || !lesson.id || !lesson.lesson_name || !lesson.context) {
//         return (
//             <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-12 text-red-600"
//             >
//                 Error: Invalid lesson data provided.
//             </motion.div>
//         );
//     }

//     const triggerConfetti = () => {
//         const duration = 5 * 1000;
//         const animationEnd = Date.now() + duration;
//         const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

//         const randomInRange = (min, max) => Math.random() * (max - min) + min;

//         const interval = window.setInterval(() => {
//             const timeLeft = animationEnd - Date.now();
//             if (timeLeft <= 0) {
//                 return clearInterval(interval);
//             }

//             const particleCount = 50 * (timeLeft / duration);
//             confetti({
//                 ...defaults,
//                 particleCount,
//                 origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
//             });
//             confetti({
//                 ...defaults,
//                 particleCount,
//                 origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
//             });
//         }, 250);
//     };

//     const fetchLessonContent = async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             const response = await axios.post("/api/lessons", {
//                 lessonId: lesson.id,
//                 languageCode,
//                 context: lesson.context,
//                 nativeLanguage,
//             });
//             if (!response.data.content) throw new Error("No content returned from API");
//             const { words, translationQuiz, fillInTheBlankQuiz, speechLang } = response.data.content;
//             setWords(words.map(word => ({ ...word, speechLang })) || []);
//             setTranslationQuiz(translationQuiz || []);
//             setFillInTheBlankQuiz(fillInTheBlankQuiz || []);
//             setSpeechLang(speechLang);
//         } catch (error) {
//             console.error("Error fetching lesson content:", error);
//             setError("Failed to load lesson content. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleQuizAnswer = (questionIndex, answer) => {
//         setQuizAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
//     };

//     const submitQuiz = async () => {
//         try {
//             const currentQuiz = quizType === "translation" ? translationQuiz : fillInTheBlankQuiz;
//             if (!currentQuiz.length) {
//                 setError("No quiz questions available for this section.");
//                 return;
//             }

//             const results = currentQuiz.map((q, i) => ({
//                 question: q.question,
//                 userAnswer: quizAnswers[i],
//                 correctAnswer: q.correctAnswer,
//                 isCorrect: quizAnswers[i] === q.correctAnswer,
//             }));
//             const correct = results.every((result) => result.isCorrect);

//             setQuizSubmitted(true);
//             setShowReportCard(true);

//             if (correct) {
//                 triggerConfetti();
//                 setError(null);
//                 if (quizType === "fillInTheBlank") {
//                     setLessonCompleted(true);
//                     await saveProgress(lesson.id, true);
//                     setTimeout(() => window.location.reload(), 2000);
//                 }
//             } else {
//                 setError("Some answers were incorrect. Please review the report card.");
//             }
//         } catch (error) {
//             console.error("Error submitting quiz:", error);
//             setError(
//                 error.message.includes("Authentication failed")
//                     ? "Authentication failed. Please sign in again."
//                     : "Failed to submit quiz. Please try again."
//             );
//         }
//     };

//     const resetQuiz = () => {
//         setQuizAnswers({});
//         setQuizSubmitted(false);
//         setShowReportCard(false);
//         setError(null);
//     };

//     const proceedToNextQuiz = () => {
//         if (quizType === "translation" && quizSubmitted) {
//             setQuizType("fillInTheBlank");
//             setQuizAnswers({});
//             setQuizSubmitted(false);
//             setShowReportCard(false);
//             setError(null);
//         }
//     };

//     const resetLesson = () => {
//         setWords([]);
//         setTranslationQuiz([]);
//         setFillInTheBlankQuiz([]);
//         setShowQuiz(false);
//         setQuizType("");
//         setQuizAnswers({});
//         setQuizSubmitted(false);
//         setShowReportCard(false);
//         setError(null);
//         setLessonCompleted(false);
//         fetchLessonContent();
//     };

//     const returnToWords = () => {
//         setShowQuiz(false);
//         setQuizType("");
//         setQuizAnswers({});
//         setQuizSubmitted(false);
//         setShowReportCard(false);
//         setError(null);
//     };

//     return (
//         <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//             className="max-w-4xl mx-auto"
//         >
//             <Card className="bg-white shadow-2xl border-0 overflow-hidden">
//                 <motion.div
//                     initial={{ y: -50 }}
//                     animate={{ y: 0 }}
//                     transition={{ type: "spring", stiffness: 100 }}
//                 >
//                     <CardHeader className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white relative overflow-hidden">
//                         <motion.div
//                             className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-30"
//                             animate={{ x: [-1000, 1000] }}
//                             transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
//                         />
//                         <CardTitle className="relative z-10 text-2xl font-bold">{lesson.lesson_name}</CardTitle>
//                     </CardHeader>
//                 </motion.div>
//                 <CardContent className="p-8">
//                     <AnimatePresence mode="wait">
//                         {error && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: -20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -20 }}
//                                 className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-sm"
//                             >
//                                 {error}
//                             </motion.div>
//                         )}
//                     </AnimatePresence>

//                     {loading ? (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             className="text-center py-12"
//                         >
//                             <motion.div
//                                 animate={{ rotate: 360 }}
//                                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                                 className="rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"
//                             />
//                             <motion.p
//                                 animate={{ opacity: [0.5, 1, 0.5] }}
//                                 transition={{ duration: 1.5, repeat: Infinity }}
//                                 className="text-lg text-gray-600"
//                             >
//                                 Loading lesson content...
//                             </motion.p>
//                         </motion.div>
//                     ) : lessonCompleted ? (
//                         <motion.div
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             className="text-center py-12"
//                         >
//                             <motion.h3
//                                 initial={{ opacity: 0, y: -20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
//                             >
//                                 🎉 Lesson Completed!
//                             </motion.h3>
//                             <p className="text-lg text-gray-600 mb-4">
//                                 Great job! You've mastered this lesson.
//                             </p>
//                             <motion.p
//                                 animate={{ opacity: [0.5, 1, 0.5] }}
//                                 transition={{ duration: 1.5, repeat: Infinity }}
//                                 className="text-sm text-gray-500"
//                             >
//                                 Returning to dashboard...
//                             </motion.p>
//                             <Button
//                                 onClick={resetLesson}
//                                 className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full"
//                             >
//                                 Restart Lesson
//                             </Button>
//                         </motion.div>
//                     ) : !words.length && !showQuiz ? (
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             className="text-center py-12"
//                         >
//                             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                 <Button
//                                     onClick={fetchLessonContent}
//                                     className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                     disabled={loading}
//                                 >
//                                     ✨ Start Lesson
//                                 </Button>
//                             </motion.div>
//                         </motion.div>
//                     ) : !showQuiz || quizType === "" ? (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             className="space-y-8"
//                         >
//                             <motion.h3
//                                 initial={{ opacity: 0, y: -20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
//                             >
//                                 📚 Learn These Words
//                             </motion.h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {words.length ? (
//                                     words.map((word, index) => (
//                                         <WordCard key={index} word={word} index={index} />
//                                     ))
//                                 ) : (
//                                     <p className="text-center text-gray-600">No words available for this lesson.</p>
//                                 )}
//                             </div>
//                             <motion.div
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: 0.5 }}
//                                 className="text-center pt-8"
//                             >
//                                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                     <Button
//                                         onClick={() => {
//                                             setShowQuiz(true);
//                                             setQuizType("translation");
//                                         }}
//                                         className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                         disabled={!words.length}
//                                     >
//                                         🎯 Take Translation Quiz
//                                     </Button>
//                                 </motion.div>
//                             </motion.div>
//                         </motion.div>
//                     ) : (
//                         <motion.div
//                             initial={{ opacity: 0, x: 50 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             className="space-y-8"
//                         >
//                             <motion.h3
//                                 initial={{ opacity: 0, y: -20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
//                             >
//                                 {quizType === "translation" ? "🎯 Translation Quiz" : "🎯 Fill-in-the-Blank Quiz"}
//                             </motion.h3>

//                             {(quizType === "translation" ? translationQuiz : fillInTheBlankQuiz).length ? (
//                                 <>
//                                     {(quizType === "translation" ? translationQuiz : fillInTheBlankQuiz).map((q, i) => (
//                                         <motion.div
//                                             key={i}
//                                             initial={{ opacity: 0, y: 20 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             transition={{ delay: i * 0.1 }}
//                                             className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 shadow-lg border border-gray-200"
//                                         >
//                                             <p className="font-semibold text-lg mb-4 text-gray-800">{q.question}</p>
//                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                                                 {q.options.map((option, j) => (
//                                                     <motion.div
//                                                         key={j}
//                                                         whileHover={{ scale: 1.02 }}
//                                                         whileTap={{ scale: 0.98 }}
//                                                     >
//                                                         <Button
//                                                             onClick={() => handleQuizAnswer(i, option)}
//                                                             disabled={quizSubmitted}
//                                                             variant={quizAnswers[i] === option ? "default" : "outline"}
//                                                             className={`w-full py-3 transition-all duration-200 ${quizAnswers[i] === option
//                                                                 ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
//                                                                 : "hover:bg-gray-50 hover:border-purple-300"
//                                                                 }`}
//                                                         >
//                                                             {option}
//                                                         </Button>
//                                                     </motion.div>
//                                                 ))}
//                                             </div>
//                                         </motion.div>
//                                     ))}
//                                     {quizSubmitted && showReportCard && (
//                                         <motion.div
//                                             initial={{ opacity: 0, y: 20 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mt-6"
//                                         >
//                                             <h4 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
//                                                 Report Card
//                                             </h4>
//                                             {(quizType === "translation" ? translationQuiz : fillInTheBlankQuiz).map((q, i) => (
//                                                 <div key={i} className="mb-4">
//                                                     <p className="font-semibold text-gray-800">{q.question}</p>
//                                                     <p className={`font-medium ${quizAnswers[i] === q.correctAnswer ? "text-green-600" : "text-red-600"}`}>
//                                                         Your Answer: {quizAnswers[i] || "Not answered"} {quizAnswers[i] === q.correctAnswer ? "✓ Correct" : `✗ Incorrect. Correct answer: ${q.correctAnswer}`}
//                                                     </p>
//                                                 </div>
//                                             ))}
//                                         </motion.div>
//                                     )}
//                                 </>
//                             ) : (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     className="text-center py-8"
//                                 >
//                                     <p className="text-center text-gray-600 mb-4">
//                                         No quiz questions available for this section.
//                                     </p>
//                                     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                         <Button
//                                             onClick={returnToWords}
//                                             className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                         >
//                                             🔙 Back to Words
//                                         </Button>
//                                     </motion.div>
//                                 </motion.div>
//                             )}

//                             {(quizType === "translation" ? translationQuiz : fillInTheBlankQuiz).length > 0 && (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     className="text-center pt-4"
//                                 >
//                                     <AnimatePresence mode="wait">
//                                         {!quizSubmitted ? (
//                                             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                                 <Button
//                                                     onClick={submitQuiz}
//                                                     className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                                     disabled={
//                                                         Object.keys(quizAnswers).length <
//                                                         (quizType === "translation" ? translationQuiz.length : fillInTheBlankQuiz.length)
//                                                     }
//                                                 >
//                                                     📝 Submit Quiz
//                                                 </Button>
//                                             </motion.div>
//                                         ) : quizType === "translation" ? (
//                                             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                                 <Button
//                                                     onClick={proceedToNextQuiz}
//                                                     className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                                     disabled={!quizSubmitted || !showReportCard}
//                                                 >
//                                                     🎯 Next Quiz (Fill-in-the-Blank)
//                                                 </Button>
//                                             </motion.div>
//                                         ) : (
//                                             <div className="flex justify-center gap-4">
//                                                 <motion.div
//                                                     initial={{ opacity: 0, scale: 0.9 }}
//                                                     animate={{ opacity: 1, scale: 1 }}
//                                                     whileHover={{ scale: 1.05 }}
//                                                     whileTap={{ scale: 0.95 }}
//                                                 >
//                                                     <Button
//                                                         onClick={resetQuiz}
//                                                         className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                                     >
//                                                         🔄 Try Quiz Again
//                                                     </Button>
//                                                 </motion.div>
//                                                 <motion.div
//                                                     initial={{ opacity: 0, scale: 0.9 }}
//                                                     animate={{ opacity: 1, scale: 1 }}
//                                                     whileHover={{ scale: 1.05 }}
//                                                     whileTap={{ scale: 0.95 }}
//                                                 >
//                                                     <Button
//                                                         onClick={resetLesson}
//                                                         className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
//                                                     >
//                                                         🔄 Restart Lesson
//                                                     </Button>
//                                                 </motion.div>
//                                             </div>
//                                         )}
//                                     </AnimatePresence>
//                                 </motion.div>
//                             )}
//                         </motion.div>
//                     )}
//                 </CardContent>
//             </Card>
//         </motion.div>
//     );
// }


"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import ReactCardFlip from "react-card-flip";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { saveProgress } from "@/app/actions/saveProgress";

const WordCard = ({ word, index }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const speakWord = (wordText) => {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(wordText);
            utterance.lang = "en-US";
            window.speechSynthesis.speak(utterance);
        }
    };

    const cardVariants = {
        initial: { opacity: 0, y: 50, scale: 0.9 },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 120,
                damping: 12
            }
        },
        hover: {
            scale: 1.05,
            y: -10,
            transition: {
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        }
    };

    const glowVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: isHovered ? 1 : 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative"
        >
            <motion.div
                variants={glowVariants}
                className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-2xl blur opacity-25"
            />
            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" key={index}>
                <motion.div
                    className="relative h-56 w-full cursor-pointer bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl p-8 flex flex-col justify-between text-white shadow-2xl border border-purple-500/20 backdrop-blur-sm"
                    onClick={() => setIsFlipped(true)}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl" />
                    <motion.div
                        className="absolute top-4 right-4 w-2 h-2 bg-purple-300 rounded-full"
                        animate={{
                            opacity: [0.5, 1, 0.5],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="text-center relative z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                            {word.word}
                        </h4>
                        <p className="text-purple-200 text-sm font-medium tracking-wide">
                            /{word.pronunciation}/
                        </p>
                    </motion.div>
                    <motion.div
                        className="flex justify-center relative z-10"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                speakWord(word.word);
                            }}
                            className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-500/40 hover:to-indigo-500/40 backdrop-blur-sm border border-purple-400/30 px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                            whileHover={{
                                boxShadow: "0 0 20px rgba(147, 51, 234, 0.4)"
                            }}
                        >
                            <span className="text-2xl mr-2">🔊</span>
                            <span className="font-medium">듣기</span>
                        </motion.button>
                    </motion.div>
                    <motion.div
                        className="text-center text-xs text-purple-200 opacity-75 relative z-10"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        ✨ 번역을 보려면 클릭하세요
                    </motion.div>
                </motion.div>
                <motion.div
                    className="relative h-56 w-full cursor-pointer bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 rounded-2xl p-8 flex flex-col justify-center text-white shadow-2xl border border-emerald-500/20 backdrop-blur-sm"
                    onClick={() => setIsFlipped(false)}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl" />
                    <motion.div
                        className="absolute top-4 right-4 w-2 h-2 bg-emerald-300 rounded-full"
                        animate={{
                            opacity: [0.5, 1, 0.5],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="text-center relative z-10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h4 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                            {word.translation}
                        </h4>
                        <p className="text-emerald-200 text-sm mb-3 font-medium">다음의 번역</p>
                        <p className="text-lg font-semibold text-emerald-100">{word.word}</p>
                    </motion.div>
                    <motion.div
                        className="text-center text-xs text-emerald-200 opacity-75 mt-4 relative z-10"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        ✨ 다시 뒤집으려면 클릭하세요
                    </motion.div>
                </motion.div>
            </ReactCardFlip>
        </motion.div>
    );
};

export default function LessonCard({ lesson }) {
    const [words, setWords] = useState([]);
    const [translationQuiz, setTranslationQuiz] = useState([]);
    const [fillInTheBlankQuiz, setFillInTheBlankQuiz] = useState([]);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizType, setQuizType] = useState("");
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lessonCompleted, setLessonCompleted] = useState(false);
    const [showReportCard, setShowReportCard] = useState(false);

    if (!lesson || !lesson.id || !lesson.title || !lesson.topic) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
            >
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-2xl shadow-2xl">
                    <span className="text-2xl mr-2">⚠️</span>
                    오류: 유효하지 않은 레슨 데이터입니다.
                </div>
            </motion.div>
        );
    }

    const triggerConfetti = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = window.setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#8B5CF6', '#A855F7', '#C084FC', '#E879F9', '#F472B6']
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#8B5CF6', '#A855F7', '#C084FC', '#E879F9', '#F472B6']
            });
        }, 250);
    };

    const fetchLessonContent = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post("/api/lessons", {
                lessonId: lesson.id,
                languageCode: "en",
                context: lesson.topic,
                nativeLanguage: "ko",
            });
            if (!response.data.content) throw new Error("API에서 콘텐츠를 반환하지 않았습니다");
            const { words, translationQuiz, fillInTheBlankQuiz } = response.data.content;
            setWords(words.map(word => ({ ...word, speechLang: "en-US" })) || []);
            setTranslationQuiz(translationQuiz || []);
            setFillInTheBlankQuiz(fillInTheBlankQuiz || []);
        } catch (error) {
            console.error("레슨 콘텐츠 가져오기 오류:", error);
            setError("레슨 콘텐츠를 불러오지 못했습니다. 다시 시도해 주세요.");
        } finally {
            setLoading(false);
        }
    };

    const handleQuizAnswer = (questionIndex, answer) => {
        setQuizAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
    };

    const submitQuiz = async () => {
        try {
            const currentQuiz = quizType === "translation" ? translationQuiz : fillInTheBlankQuiz;
            if (!currentQuiz.length) {
                setError("이 섹션에 퀴즈 문제가 없습니다.");
                return;
            }

            const results = currentQuiz.map((q, i) => ({
                question: q.question,
                userAnswer: quizAnswers[i],
                correctAnswer: q.correctAnswer,
                isCorrect: quizAnswers[i] === q.correctAnswer,
            }));
            const correct = results.every((result) => result.isCorrect);

            setQuizSubmitted(true);
            setShowReportCard(true);

            if (correct) {
                triggerConfetti();
                setError(null);
                if (quizType === "fillInTheBlank") {
                    setLessonCompleted(true);
                    await saveProgress(lesson.id, true);
                    setTimeout(() => window.location.reload(), 2000);
                }
            } else {
                setError("몇 가지 답변이 틀렸습니다. 성적표를 검토해 주세요.");
            }
        } catch (error) {
            console.error("퀴즈 제출 오류:", error);
            setError(
                error.message.includes("Authentication failed")
                    ? "인증에 실패했습니다. 다시 로그인해 주세요."
                    : "퀴즈를 제출하지 못했습니다. 다시 시도해 주세요."
            );
        }
    };

    const resetQuiz = () => {
        setQuizAnswers({});
        setQuizSubmitted(false);
        setShowReportCard(false);
        setError(null);
    };

    const proceedToNextQuiz = () => {
        if (quizType === "translation" && quizSubmitted) {
            setQuizType("fillInTheBlank");
            setQuizAnswers({});
            setQuizSubmitted(false);
            setShowReportCard(false);
            setError(null);
        }
    };

    const resetLesson = () => {
        setWords([]);
        setTranslationQuiz([]);
        setFillInTheBlankQuiz([]);
        setShowQuiz(false);
        setQuizType("");
        setQuizAnswers({});
        setQuizSubmitted(false);
        setShowReportCard(false);
        setError(null);
        setLessonCompleted(false);
        fetchLessonContent();
    };

    const returnToWords = () => {
        setShowQuiz(false);
        setQuizType("");
        setQuizAnswers({});
        setQuizSubmitted(false);
        setShowReportCard(false);
        setError(null);
    };

    const containerVariants = {
        initial: { opacity: 0, y: 50 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const headerVariants = {
        initial: { opacity: 0, y: -30 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                type: "spring",
                stiffness: 120,
                damping: 15
            }
        }
    };

    const LoadingSpinner = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
        >
            <div className="relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-6"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 w-20 h-20 border-2 border-purple-400 rounded-full mx-auto"
                />
            </div>
            <motion.div
                animate={{
                    opacity: [0.5, 1, 0.5],
                    y: [0, -5, 0]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="text-lg text-purple-600 font-medium"
            >
                <span className="text-2xl mr-2">✨</span>
                마법 같은 레슨 콘텐츠 로딩 중...
            </motion.div>
        </motion.div>
    );

    const EnhancedButton = ({ children, onClick, className = "", disabled = false, variant = "primary" }) => {
        const variants = {
            primary: "bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 hover:from-purple-900 hover:via-purple-800 hover:to-indigo-900 border border-purple-600/50",
            secondary: "bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 hover:from-emerald-800 hover:via-teal-800 hover:to-cyan-800 border border-emerald-600/50",
            accent: "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-700 hover:via-purple-700 hover:to-indigo-700 border border-pink-500/50"
        };

        return (
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
            >
                <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-all duration-300"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <Button
                    onClick={onClick}
                    disabled={disabled}
                    className={`relative text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-purple-500/25 ${variants[variant]} ${className}`}
                >
                    {children}
                </Button>
            </motion.div>
        );
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="max-w-5xl mx-auto"
        >
            <Card className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 shadow-2xl border-0 overflow-hidden backdrop-blur-sm">
                <motion.div
                    variants={headerVariants}
                    initial="initial"
                    animate="animate"
                    className="relative"
                >
                    <CardHeader className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden border-b border-purple-500/20">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20"
                            animate={{
                                x: [-1000, 1000],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div
                            className="absolute top-4 right-4"
                            animate={{
                                rotate: [0, 360],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <div className="w-3 h-3 bg-purple-300 rounded-full opacity-75" />
                        </motion.div>
                        <CardTitle className="relative z-10 text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                            <span className="text-4xl mr-3">📚</span>
                            {lesson.title}
                        </CardTitle>
                    </CardHeader>
                </motion.div>
                <CardContent className="p-8 bg-gradient-to-b from-gray-900/50 to-purple-900/30 backdrop-blur-sm">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                className="relative mb-6"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur opacity-50" />
                                <div className="relative bg-gradient-to-r from-red-500/90 to-pink-500/90 backdrop-blur-sm border border-red-400/30 text-white px-6 py-4 rounded-2xl shadow-2xl">
                                    <span className="text-2xl mr-2">⚠️</span>
                                    {error}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {loading ? (
                        <LoadingSpinner />
                    ) : lessonCompleted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16"
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-8xl mb-8"
                            >
                                🎉
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent"
                            >
                                레슨 완료!
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg text-gray-300 mb-6"
                            >
                                훌륭한 성과입니다! 이 레슨을 완벽히 마스터했어요.
                            </motion.p>
                            <motion.p
                                animate={{
                                    opacity: [0.5, 1, 0.5],
                                    y: [0, -5, 0]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-sm text-purple-300 mb-6"
                            >
                                ✨ 대시보드로 돌아가는 중...
                            </motion.p>
                            <EnhancedButton onClick={resetLesson} variant="accent">
                                🔄 레슨 다시 시작
                            </EnhancedButton>
                        </motion.div>
                    ) : !words.length && !showQuiz ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-16"
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-6xl mb-8"
                            >
                                ✨
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl font-bold mb-6 text-purple-200"
                            >
                                학습 여정을 시작할 준비 되셨나요?
                            </motion.h3>
                            <EnhancedButton onClick={fetchLessonContent} disabled={loading}>
                                🚀 레슨 시작
                            </EnhancedButton>
                        </motion.div>
                    ) : !showQuiz || quizType === "" ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-10"
                        >
                            <motion.h3
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent"
                            >
                                📚 이 단어들을 마스터하세요
                            </motion.h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {words.length ? (
                                    words.map((word, index) => (
                                        <WordCard key={index} word={word} index={index} />
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="col-span-full text-center py-12"
                                    >
                                        <div className="text-4xl mb-4">📖</div>
                                        <p className="text-purple-200">이 레슨에 사용 가능한 단어가 없습니다.</p>
                                    </motion.div>
                                )}
                            </div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="text-center pt-8"
                            >
                                <EnhancedButton
                                    onClick={() => {
                                        setShowQuiz(true);
                                        setQuizType("translation");
                                    }}
                                    disabled={!words.length}
                                    variant="secondary"
                                >
                                    🎯 번역 퀴즈 시작
                                </EnhancedButton>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            <motion.h3
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent"
                            >
                                {quizType === "translation" ? "🎯 번역 도전" : "🎯 빈칸 채우기 도전"}
                            </motion.h3>
                            {(quizType === "translation" ? translationQuiz : fillInTheBlankQuiz).length ? (
                                <>
                                    <div className="space-y-6">
                                        {(quizType === "translation" ? translationQuiz : fillInTheBlankQuiz).map((q, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.15 }}
                                                className="relative group"
                                            >
                                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                                <div className="relative bg-gradient-to-br from-gray-800/50 to-purple-800/30 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-500/20">
                                                    <p className="font-semibold text-xl mb-6 text-purple-100">
                                                        <span className="text-purple-300 mr-2">Q{i + 1}:</span>
                                                        {q.question}
                                                    </p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {q.options.map((option, j) => (
                                                            <motion.div
                                                                key={j}
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                className="relative"
                                                            >
                                                                <motion.div
                                                                    className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"
                                                                    animate={{
                                                                        opacity: quizAnswers[i] === option ? 1 : 0
                                                                    }}
                                                                />
                                                                <Button
                                                                    onClick={() => handleQuizAnswer(i, option)}
                                                                    disabled={quizSubmitted}
                                                                    className={`relative w-full py-4 text-base font-medium transition-all duration-300 rounded-xl border ${quizAnswers[i] === option
                                                                        ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white border-purple-500/50 shadow-lg shadow-purple-500/25"
                                                                        : "bg-gradient-to-r from-gray-700/50 to-gray-600/50 text-gray-200 border-gray-600/30 hover:from-purple-700/30 hover:to-indigo-700/30 hover:border-purple-500/50"
                                                                        }`}
                                                                >
                                                                    {option}
                                                                </Button>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    {quizSubmitted && showReportCard && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="relative mt-8"
                                        >
                                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur" />
                                            <div className="relative bg-gradient-to-br from-gray-800/70 to-emerald-800/30 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-emerald-500/20">
                                                <motion.h4
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent"
                                                >
                                                    📊 성적표
                                                </motion.h4>
                                                <div className="space-y-4">
                                                    {(quizType === "translation" ? translationQuiz : fillInTheBlankQuiz).map((q, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className="bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-xl p-4 border border-gray-600/20"
                                                        >
                                                            <p className="font-semibold text-gray-200 mb-2">
                                                                <span className="text-purple-300 mr-2">Q{i + 1}:</span>
                                                                {q.question}
                                                            </p>
                                                            <p className={`font-medium flex items-center ${quizAnswers[i] === q.correctAnswer ? "text-emerald-400" : "text-red-400"
                                                                }`}>
                                                                <span className="mr-2">
                                                                    {quizAnswers[i] === q.correctAnswer ? "✅" : "❌"}
                                                                </span>
                                                                내 답변: {quizAnswers[i] || "답변하지 않음"}
                                                                {quizAnswers[i] !== q.correctAnswer && (
                                                                    <span className="ml-2 text-yellow-400">
                                                                        (정답: {q.correctAnswer})
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-12"
                                >
                                    <div className="text-4xl mb-4">📝</div>
                                    <p className="text-purple-200 mb-6">
                                        이 섹션에 사용 가능한 퀴즈 문제가 없습니다.
                                    </p>
                                    <EnhancedButton onClick={returnToWords}>
                                        🔙 단어로 돌아가기
                                    </EnhancedButton>
                                </motion.div>
                            )}
                            {(quizType === "translation" ? translationQuiz : fillInTheBlankQuiz).length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-center pt-8"
                                >
                                    <AnimatePresence mode="wait">
                                        {!quizSubmitted ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                            >
                                                <EnhancedButton
                                                    onClick={submitQuiz}
                                                    disabled={
                                                        Object.keys(quizAnswers).length <
                                                        (quizType === "translation" ? translationQuiz.length : fillInTheBlankQuiz.length)
                                                    }
                                                    variant="secondary"
                                                >
                                                    📝 퀴즈 제출
                                                </EnhancedButton>
                                            </motion.div>
                                        ) : quizType === "translation" ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                            >
                                                <EnhancedButton
                                                    onClick={proceedToNextQuiz}
                                                    disabled={!quizSubmitted || !showReportCard}
                                                    variant="accent"
                                                >
                                                    🎯 다음 도전 (빈칸 채우기)
                                                </EnhancedButton>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="flex flex-col sm:flex-row justify-center gap-4"
                                            >
                                                <EnhancedButton
                                                    onClick={resetQuiz}
                                                    variant="primary"
                                                >
                                                    🔄 다시 시도
                                                </EnhancedButton>
                                                <EnhancedButton
                                                    onClick={resetLesson}
                                                    variant="accent"
                                                >
                                                    🔄 레슨 다시 시작
                                                </EnhancedButton>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}