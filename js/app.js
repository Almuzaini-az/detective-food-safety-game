const { useState, useEffect } = React;

        // --- دالة خلط المصفوفات (لعشوائية الاختيارات) ---
        const shuffleArray = (array) => {
            let newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        };

        // ==========================================
        // Stage 1: The Kitchen (Find the Hazards)
        // ==========================================
        const KitchenStage = ({ onComplete }) => {
            const [items, setItems] = useState(() => shuffleArray([
                { id: 1, icon: "🥩🔪🥒", name: "لوح تقطيع واحد للحم والخضار", isHazard: true, found: false, hint: "تلوث خلطي!" },
                { id: 2, icon: "🥫💥", name: "علبة معلبات منتفخة", isHazard: true, found: false, hint: "دليل على الفساد!" },
                { id: 3, icon: "🍲♨️", name: "طعام مطبوخ متروك خارج الثلاجة", isHazard: true, found: false, hint: "تتكاثر فيه البكتيريا!" },
                { id: 4, icon: "🥬💧", name: "غسل الخضروات بالماء قبل تناولها", isHazard: false, found: false, hint: "تصرف سليم" },
                { id: 5, icon: "🍲🔥", name: "طهي الطعام جيدا", isHazard: false, found: false, hint: "تصرف سليم" },
                { id: 6, icon: "🍽️✨", name: "استخدام اواني نظيفة", isHazard: false, found: false, hint: "تصرف سليم" }
            ]));
            const [hazardsFound, setHazardsFound] = useState(0);
            const [message, setMessage] = useState("");

            const handleItemClick = (item) => {
                if (item.found) return;

                if (item.isHazard) {
                    // Correct! Found a hazard
                    const newItems = items.map(i => i.id === item.id ? { ...i, found: true } : i);
                    setItems(newItems);
                    setHazardsFound(prev => prev + 1);
                    setMessage(`✅ أحسنت! ${item.name} (${item.hint})`);
                    
                    if (hazardsFound + 1 === 3) {
                        setTimeout(() => onComplete(100), 2000);
                    }
                } else {
                    // Wrong! Clicked a safe item
                    setMessage(`❌ احذر! ${item.name} هو تصرف صحي وليس خطراً.`);
                }
            };

            return (
                <div className="flex flex-col items-center pop-in">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">المرحلة الأولى: فحص المطبخ 🕵️‍♂️</h2>
                    <p className="text-lg text-slate-600 mb-6 bg-yellow-100 p-3 rounded-lg border border-yellow-300">
                        ابحث عن <strong className="text-red-600">3 أخطاء</strong> في هذا المطبخ تسبب التسمم الغذائي.
                    </p>
                    
                    <div className="text-xl font-bold text-blue-600 mb-4">الأخطاء المكتشفة: {hazardsFound} / 3</div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full mb-6">
                        {items.map(item => (
                            <div 
                                key={item.id} 
                                onClick={() => handleItemClick(item)}
                                className={`kitchen-item bg-white p-6 rounded-2xl shadow-md border-2 text-center relative ${item.found ? 'found border-green-500 bg-green-50' : 'border-slate-200 hover:border-blue-400'}`}
                            >
                                <div className="text-5xl mb-3">{item.icon}</div>
                                <div className="text-sm font-semibold text-slate-700">{item.name}</div>
                                {item.found && <div className="absolute top-2 right-2 text-green-500 text-2xl"><i className="fa-solid fa-circle-check"></i></div>}
                            </div>
                        ))}
                    </div>

                    <div className="h-12 flex items-center justify-center">
                        {message && (
                            <div className={`text-lg font-bold px-4 py-2 rounded-full pop-in ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            );
        };

        // ==========================================
        // Stage 2: The Clinic (Catch Symptoms)
        // ==========================================
        const ClinicStage = ({ onComplete }) => {
            const [symptoms, setSymptoms] = useState(() => shuffleArray([
                { id: 1, text: "غثيان", isTrue: true, caught: false },
                { id: 2, text: "ألم أسنان", isTrue: false, caught: false },
                { id: 3, text: "تقلصات في المعدة", isTrue: true, caught: false },
                { id: 4, text: "سعال", isTrue: false, caught: false },
                { id: 5, text: "إسهال وقيء", isTrue: true, caught: false },
                { id: 6, text: "فقدان الذاكرة", isTrue: false, caught: false },
            ]));
            const [caughtCount, setCaughtCount] = useState(0);
            const [mistakes, setMistakes] = useState(0);

            const handleCatch = (symptom) => {
                if (symptom.caught) return;

                if (symptom.isTrue) {
                    setSymptoms(prev => prev.map(s => s.id === symptom.id ? { ...s, caught: true } : s));
                    setCaughtCount(prev => prev + 1);
                    if (caughtCount + 1 === 3) {
                        setTimeout(() => onComplete(100 - (mistakes * 10)), 1500);
                    }
                } else {
                    setMistakes(prev => prev + 1);
                    // Add shake effect briefly
                    const el = document.getElementById(`symp-${symptom.id}`);
                    if(el) { el.classList.add('shake', 'bg-red-500', 'text-white'); setTimeout(()=> el.classList.remove('shake', 'bg-red-500', 'text-white'), 500); }
                }
            };

            return (
                <div className="flex flex-col items-center pop-in">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">المرحلة الثانية: تشخيص المريض 🩺</h2>
                    <p className="text-lg text-slate-600 mb-6 bg-blue-100 p-3 rounded-lg border border-blue-300">
                        المريض يشعر بألم! التقط <strong className="text-blue-700">3 أعراض صحيحة</strong> للتسمم الغذائي.
                    </p>
                    
                    <div className="flex gap-4 mb-8">
                        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-bold">الأعراض الصحيحة: {caughtCount}/3</div>
                        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-bold">الأخطاء: {mistakes}</div>
                    </div>

                    <div className="relative w-full max-w-2xl h-64 bg-slate-50 border-4 border-slate-200 rounded-3xl p-4 flex flex-wrap gap-4 justify-center items-center">
                        {symptoms.map(symp => (
                            <button
                                id={`symp-${symp.id}`}
                                key={symp.id}
                                onClick={() => handleCatch(symp)}
                                disabled={symp.caught}
                                className={`text-lg font-bold px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110
                                    ${symp.caught ? 'bg-emerald-500 text-white scale-0 opacity-0 absolute' : 'bg-white text-blue-800 border-2 border-blue-200 float'}
                                `}
                                style={{ animationDelay: `${symp.id * 0.2}s` }}
                            >
                                {symp.text}
                            </button>
                        ))}
                        
                        {/* Display caught symptoms */}
                        <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                            {symptoms.filter(s => s.caught).map(s => (
                                <div key={s.id} className="bg-emerald-500 text-white px-3 py-1 rounded-full font-bold pop-in text-sm">
                                    <i className="fa-solid fa-check mr-1"></i> {s.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        };

        // ==========================================
        // Stage 3: The Newsroom (Build the Report)
        // ==========================================
        const NewsStage = ({ onComplete }) => {
            const [selectedPiece, setSelectedPiece] = useState(null);
            const [slots, setSlots] = useState([
                { id: "title", label: "عنوان الخبر", content: null, requiredType: "title" },
                { id: "location_time", label: "الزمان والمكان", content: null, requiredType: "location_time" },
                { id: "content", label: "محتوى الخبر (ماذا حدث؟ ولماذا؟)", content: null, requiredType: "content" },
                { id: "source", label: "مصدر الخبر", content: null, requiredType: "source" }
            ]);
            
            const [pieces, setPieces] = useState(() => shuffleArray([
                { id: "p1", type: "content", text: "بسبب إصابة 5 أشخاص بتسمم غذائي ميكروبي نتيجة سوء تخزين اللحوم وعدم طهيها جيداً.", used: false },
                { id: "p2", type: "location_time", text: "مساء أمس الجمعة، في أحد مطاعم حي السعادة.", used: false },
                { id: "p3", type: "title", text: "إغلاق مطعم مخالف لضوابط السلامة الغذائية", used: false },
                { id: "p4", type: "source", text: "نقلاً عن المتحدث الرسمي لوزارة الصحة السعودية.", used: false }
            ]));

            const [errorMsg, setErrorMsg] = useState("");

            const handlePieceClick = (piece) => {
                if (piece.used) return;
                setSelectedPiece(piece.id === selectedPiece ? null : piece.id);
                setErrorMsg("");
            };

            const handleSlotClick = (slotIndex) => {
                if (!selectedPiece) return;
                
                const piece = pieces.find(p => p.id === selectedPiece);
                const targetSlot = slots[slotIndex];

                if (piece.type === targetSlot.requiredType) {
                    // Match!
                    const newSlots = [...slots];
                    newSlots[slotIndex].content = piece.text;
                    setSlots(newSlots);

                    const newPieces = pieces.map(p => p.id === piece.id ? { ...p, used: true } : p);
                    setPieces(newPieces);
                    setSelectedPiece(null);

                    // Check win
                    if (newSlots.every(s => s.content !== null)) {
                        setTimeout(() => onComplete(100), 2000);
                    }
                } else {
                    // Mismatch
                    setErrorMsg("❌ هذا الجزء لا يناسب هذا المكان! تذكر بنية الخبر الصحفي.");
                    setSelectedPiece(null);
                }
            };

            return (
                <div className="flex flex-col items-center pop-in w-full max-w-5xl">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">المرحلة الثالثة: صياغة الخبر 📰</h2>
                    <p className="text-lg text-slate-600 mb-6 bg-purple-100 p-3 rounded-lg border border-purple-300 text-center">
                        الآن، ضع الأجزاء في الصحيفة الحقيقية لتكتمل الصفحة الأولى. <strong>اختر مسودة المراسل، ثم ضعها في المكان الصحيح بالجريدة.</strong>
                    </p>

                    {/* Editor's Desk (Draft Pieces) */}
                    <div className="w-full bg-[#334155] p-6 rounded-xl shadow-lg border-t-8 border-slate-900 relative mb-8">
                        <div className="absolute -top-4 right-8 bg-amber-400 text-amber-900 px-3 py-1 text-xs font-bold rounded-sm shadow transform rotate-2">مكتب التحرير</div>
                        <h4 className="text-white font-bold mb-4 flex items-center"><i className="fa-solid fa-file-lines mr-2"></i> مسودات المراسل (اختر الجملة ثم ضعها في الجريدة):</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pieces.map(piece => (
                                <button
                                    key={piece.id}
                                    onClick={() => handlePieceClick(piece)}
                                    disabled={piece.used}
                                    className={`torn-paper text-right p-4 rounded-sm text-sm md:text-base font-bold text-slate-800 transition-all duration-300
                                        ${piece.used ? 'opacity-0 scale-50 pointer-events-none' : 'hover:-translate-y-1 hover:shadow-lg'}
                                        ${selectedPiece === piece.id ? 'ring-4 ring-blue-500 transform scale-105 z-10 bg-white' : ''}
                                    `}
                                >
                                    <i className="fa-solid fa-thumbtack text-red-500 absolute top-2 left-2 transform -rotate-45"></i>
                                    {piece.text}
                                </button>
                            ))}
                        </div>

                        {errorMsg && (
                            <div className="mt-4 p-3 bg-red-500 text-white rounded-lg text-sm font-bold pop-in text-center shadow-lg border-2 border-red-700">
                                {errorMsg}
                            </div>
                        )}
                    </div>

                    <div className="newspaper-page p-4 md:p-8 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-x-4 border-slate-700 w-full mb-8 text-slate-900 font-serif">
                        {/* Newspaper Header */}
                        <div className="border-b-4 border-double border-slate-800 pb-4 mb-6 text-center">
                            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-2">صَحِيفَةُ الحَقِيقَة</h1>
                            <div className="flex justify-between border-y-2 border-slate-800 py-1 text-xs md:text-sm font-bold uppercase">
                                <span>العدد: 4501</span>
                                <span>النسخة الصباحية - {new Date().toLocaleDateString('ar-EG')}</span>
                                <span>الصفحة الأولى</span>
                            </div>
                        </div>

                        {/* Newspaper Content Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Fake Article (Side column) */}
                            <div className="hidden md:block col-span-1 border-l border-slate-400 pl-4">
                                <h3 className="font-bold text-lg mb-2 border-b border-slate-300 pb-1">الطقس اليوم</h3>
                                <p className="text-xs text-justify text-slate-700 mb-4 leading-relaxed">
                                    تتوقع الأرصاد الجوية استمرار الأجواء المعتدلة على معظم مناطق المملكة، مع فرصة لتشكل سحب رعدية ممطرة على المرتفعات.
                                </p>
                                <h3 className="font-bold text-lg mb-2 border-b border-slate-300 pb-1">رؤية هلال شوال</h3>
                                <p className="text-xs text-justify text-slate-700 leading-relaxed">
                                    أعلنت المحكمة العليا ثبوت رؤية هلال شهر شوال، ليكون يوم غدٍ هو أول أيام عيد الفطر المبارك، أعاده الله علينا وعليكم باليمن والبركات.
                                </p>
                            </div>

                            {/* Main Interactive Article */}
                            <div className="col-span-1 md:col-span-3">
                                <div className="bg-white p-5 border-2 border-slate-800 shadow-[4px_4px_0_0_rgba(30,41,59,1)] relative">
                                    <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1 text-sm font-bold transform -translate-y-1/2 translate-x-4 rotate-3 shadow-md z-10">
                                        خَبَر عاجِل
                                    </div>
                                    
                                    {/* Slots List inside the newspaper */}
                                    <div className="space-y-4 mt-2">
                                        {/* Title Slot */}
                                        <div onClick={() => handleSlotClick(0)} className={`newspaper-slot rounded min-h-[60px] cursor-pointer flex items-center justify-center p-4 transition-colors ${slots[0].content ? 'border-none' : 'bg-slate-50 hover:bg-blue-50'} ${selectedPiece && !slots[0].content ? 'border-blue-400 animate-pulse' : ''}`}>
                                            {slots[0].content ? <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight text-center w-full">{slots[0].content}</h2> : <span className="text-slate-400"><i className="fa-solid fa-plus mr-2"></i> {slots[0].label}</span>}
                                        </div>

                                        {/* Meta: Location & Time and Source (Small text under title) */}
                                        <div className="flex flex-col md:flex-row gap-4 border-y border-slate-200 py-2">
                                            <div onClick={() => handleSlotClick(1)} className={`newspaper-slot flex-1 rounded min-h-[40px] cursor-pointer flex items-center justify-center p-2 text-sm italic ${slots[1].content ? 'border-none' : 'bg-slate-50 hover:bg-blue-50'} ${selectedPiece && !slots[1].content ? 'border-blue-400 animate-pulse' : ''}`}>
                                                {slots[1].content ? <span className="text-slate-600 w-full text-right"><i className="fa-regular fa-clock ml-1"></i> {slots[1].content}</span> : <span className="text-slate-400"><i className="fa-solid fa-plus mr-2"></i> {slots[1].label}</span>}
                                            </div>
                                            <div onClick={() => handleSlotClick(3)} className={`newspaper-slot flex-1 rounded min-h-[40px] cursor-pointer flex items-center justify-center p-2 text-sm font-bold ${slots[3].content ? 'border-none' : 'bg-slate-50 hover:bg-blue-50'} ${selectedPiece && !slots[3].content ? 'border-blue-400 animate-pulse' : ''}`}>
                                                {slots[3].content ? <span className="text-blue-900 w-full text-right"><i className="fa-solid fa-pen-nib ml-1"></i> {slots[3].content}</span> : <span className="text-slate-400"><i className="fa-solid fa-plus mr-2"></i> {slots[3].label}</span>}
                                            </div>
                                        </div>

                                        {/* Content Slot */}
                                        <div onClick={() => handleSlotClick(2)} className={`newspaper-slot rounded min-h-[100px] cursor-pointer flex items-center justify-center p-4 ${slots[2].content ? 'border-none' : 'bg-slate-50 hover:bg-blue-50'} ${selectedPiece && !slots[2].content ? 'border-blue-400 animate-pulse' : ''}`}>
                                            {slots[2].content ? <p className="text-xl text-slate-800 leading-relaxed text-justify w-full">{slots[2].content}</p> : <span className="text-slate-400"><i className="fa-solid fa-plus mr-2"></i> {slots[2].label}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        // ==========================================
        // Main Application
        // ==========================================
        function App() {
            const [stage, setStage] = useState('intro'); // intro, kitchen, clinic, newsroom, end
            const [score, setScore] = useState(0);

            const startStage = (nextStage) => {
                setStage(nextStage);
            };

            const completeStage = (points, nextStage) => {
                setScore(prev => prev + points);
                setStage(nextStage);
            };

            return (
                <div className="flex justify-center items-center min-h-screen p-4 md:p-8">
                    <div className="game-container w-full max-w-5xl p-6 md:p-10 relative">
                        
                        {/* Header Overlay */}
                        {stage !== 'intro' && stage !== 'end' && (
                            <div className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b px-6 py-3 flex justify-between items-center z-10">
                                <div className="font-bold text-slate-700">
                                    <i className="fa-solid fa-star text-yellow-500 mr-2"></i> 
                                    النقاط: {score}
                                </div>
                                <div className="flex gap-2">
                                    <div className={`w-3 h-3 rounded-full ${stage === 'kitchen' ? 'bg-blue-600 ring-4 ring-blue-200' : 'bg-green-500'}`}></div>
                                    <div className={`w-3 h-3 rounded-full ${stage === 'clinic' ? 'bg-blue-600 ring-4 ring-blue-200' : stage === 'newsroom' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                    <div className={`w-3 h-3 rounded-full ${stage === 'newsroom' ? 'bg-blue-600 ring-4 ring-blue-200' : 'bg-slate-300'}`}></div>
                                </div>
                            </div>
                        )}

                        <div className={`mt-10 ${stage === 'intro' || stage === 'end' ? 'mt-0' : ''}`}>
                            
                            {/* Intro */}
                            {stage === 'intro' && (
                                <div className="text-center pop-in py-10">
                                    <div className="text-7xl mb-6 float">📰🔬</div>
                                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">مهمة المحقق الصحفي</h1>
                                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                                        حدثت حالات تسمم غذائي غامضة في المدينة! مهمتك هي تقصي الحقائق في المطبخ، مساعدة الطبيب في العيادة، ثم كتابة خبر صحفي لتحذير المجتمع.
                                    </p>
                                    <button 
                                        onClick={() => startStage('kitchen')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-10 rounded-full shadow-lg shadow-blue-500/50 transition transform hover:scale-105"
                                    >
                                        ابدأ المهمة الآن <i className="fa-solid fa-arrow-left ml-2"></i>
                                    </button>
                                </div>
                            )}

                            {/* Game Stages */}
                            {stage === 'kitchen' && <KitchenStage onComplete={(pts) => completeStage(pts, 'clinic')} />}
                            {stage === 'clinic' && <ClinicStage onComplete={(pts) => completeStage(pts, 'newsroom')} />}
                            {stage === 'newsroom' && <NewsStage onComplete={(pts) => completeStage(pts, 'end')} />}

                            {/* End Screen */}
                            {stage === 'end' && (
                                <div className="text-center pop-in py-10">
                                    <div className="text-7xl mb-6 text-yellow-500 bounce">🏆</div>
                                    <h1 className="text-4xl font-extrabold text-slate-800 mb-4">اكتملت المهمة بامتياز!</h1>
                                    <p className="text-xl text-slate-600 mb-6">لقد حددت سبب التسمم، وشخصت الأعراض، وصغت خبراً صحفياً احترافياً.</p>
                                    
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-indigo-100 max-w-md mx-auto mb-8 shadow-inner">
                                        <h2 className="text-2xl font-bold text-indigo-900 mb-2">الرصيد النهائي</h2>
                                        <div className="text-5xl font-black text-indigo-600">{score}</div>
                                        <div className="mt-4 text-sm font-bold text-indigo-800 flex justify-center gap-4">
                                            <span className="flex items-center"><i className="fa-solid fa-shield-halved text-green-500 ml-1"></i> خبير سلامة</span>
                                            <span className="flex items-center"><i className="fa-solid fa-pen-nib text-purple-500 ml-1"></i> صحفي محترف</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => { setScore(0); startStage('intro'); }}
                                        className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-105"
                                    >
                                        <i className="fa-solid fa-rotate-right ml-2"></i> إعادة اللعب
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                        <footer className="w-full text-center mt-8 pt-6 pb-4 pop-in">
                        <div className="max-w-md mx-auto bg-slate-800/90 border border-slate-700 p-5 rounded-2xl shadow-lg">
                            <p className="text-slate-300 mb-3 text-sm md:text-base">
                                لتصميم وبرمجة ألعاب وتطبيقات تفاعلية مشابهة، تواصل مع المطور:
                            </p>
                            <div className="flex flex-col items-center gap-3">
                                <span className="font-bold text-white text-lg">Abdulaziz Almuzaini</span>
                                <a href="https://wa.me/966561277572" target="_blank" rel="noopener noreferrer" 
                                   className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-full font-bold transition-transform hover:scale-105 shadow-md">
                                    <i className="fa-brands fa-whatsapp text-xl"></i> تواصل عبر واتساب
                                </a>
                            </div>
                        </div>
                    </footer>
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);

