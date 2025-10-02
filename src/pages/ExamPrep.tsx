import React from 'react';
import { BookOpen, ClipboardCheck, Target, Clock, CheckCircle2 } from 'lucide-react';

const tiles = [
    { icon: BookOpen, title: 'Study Plans', desc: 'Curated paths by topic' },
    { icon: ClipboardCheck, title: 'Practice Sets', desc: 'Timed MCQs & coding' },
    { icon: Target, title: 'Weak Areas', desc: 'Identify and improve' },
    { icon: Clock, title: 'Daily Goal', desc: 'Stay consistent' },
];

const ExamPrep: React.FC = () => {
    return (
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 items-start py-10 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <h1 className="text-3xl font-semibold text-teal-700">Exam Prep</h1>
                    <p className="mt-2 text-stone-600">Plan, practice, and track your preparation in one place.</p>

                    <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2">
                        {tiles.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="p-5 bg-white rounded-xl border border-teal-100 shadow-md">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#0d948815', color: '#0d9488' }}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-base font-medium text-stone-800">{title}</div>
                                        <div className="text-sm text-stone-600">{desc}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <aside className="p-5 bg-gradient-to-br from-teal-50 to-stone-50 rounded-xl border border-teal-100 shadow-md">
                    <h2 className="mb-4 text-lg font-semibold text-teal-700">Quick Start</h2>
                    <ul className="space-y-3">
                        {[
                            'Select a topic to focus on',
                            'Start a 20-minute timed set',
                            'Review explanations thoroughly',
                            'Track weak areas to revisit',
                        ].map((item) => (
                            <li key={item} className="flex items-start space-x-2">
                                <CheckCircle2 className="mt-0.5 w-4 h-4 text-teal-600" />
                                <span className="text-sm text-stone-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </div>
    );
};

export default ExamPrep;

