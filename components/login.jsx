const LoginScreen = ({ auth }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        auth.signInWithEmailAndPassword(email, password)
            .catch(err => {
                setError('بيانات الدخول غير صحيحة.');
                setIsLoading(false);
            });
    };

    return (
        <div className="flex items-center justify-center h-screen w-full relative z-10 p-4">
            <div className="admin-panel p-8 rounded-3xl w-full max-w-md shadow-2xl flex flex-col gap-6 animate-fadeIn">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-[rgba(56,189,248,0.15)] border border-[rgba(56,189,248,0.3)] flex justify-center items-center mx-auto mb-4 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                        <i className="fas fa-user-shield text-4xl text-[var(--primary)]"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text-main)] mb-1">تسجيل الدخول</h2>
                    <p className="text-[var(--text-muted)] text-sm font-bold">أدخل بيانات المدير للوصول للوحة التحكم</p>
                </div>
                {error && (
                    <div className="bg-[rgba(239,68,68,0.15)] border border-[var(--error)] text-[var(--error)] p-3 rounded-xl text-sm font-bold text-center">
                        <i className="fas fa-exclamation-circle mr-1"></i> {error}
                    </div>
                )}
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">البريد الإلكتروني</label>
                        <input type="email" required dir="ltr" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-main)] rounded-xl p-3 outline-none focus:border-[var(--primary)] focus:shadow-[0_0_10px_rgba(56,189,248,0.2)] transition-all text-sm font-bold" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">كلمة المرور</label>
                        <input type="password" required dir="ltr" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-main)] rounded-xl p-3 outline-none focus:border-[var(--primary)] focus:shadow-[0_0_10px_rgba(56,189,248,0.2)] transition-all text-sm font-bold" />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full mt-2 bg-gradient-to-l from-[var(--primary)] to-[var(--primary-hover)] text-white p-3 rounded-xl transition-all shadow-md font-bold text-base hover:-translate-y-0.5 disabled:opacity-50">
                        {isLoading ? <i className="fas fa-spinner fa-spin text-lg"></i> : 'دخول'}
                    </button>
                </form>
            </div>
        </div>
    );
};