const Emails = (props) => {
    const { emailsData, isFetchingEmails, expandedEmailId, setExpandedEmailId, setConfirmDialog, database, timeAgoFormatter } = props;
    return (
        <div className="admin-panel p-8 rounded-3xl flex flex-col min-h-[500px] h-full animate-fadeIn">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--glass-border)]">
                <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(56,189,248,0.15)] flex items-center justify-center border border-[rgba(56,189,248,0.3)] shadow-sm">
                        <i className="fas fa-inbox text-[var(--primary)] text-xl"></i>
                    </div>
                    صندوق الوارد
                </h3>
                <button onClick={() => setConfirmDialog({ isOpen: true, message: 'تأكيد حذف جميع الرسائل نهائياً؟', onConfirm: () => database.ref('emails').remove() })} className="bg-[var(--inner-bg)] hover:bg-[var(--error)] hover:text-white text-[var(--text-main)] border border-[var(--glass-border)] hover:border-[var(--error)] px-5 py-2.5 rounded-xl transition-all text-sm font-bold flex items-center gap-2 shadow-sm">
                    <i className="fas fa-trash-alt text-sm"></i> حذف الكل
                </button>
            </div>
            
            <div className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-2">
                {isFetchingEmails && emailsData.length === 0 ? (
                    <div className="text-center p-16 text-[var(--text-muted)] flex flex-col items-center justify-center flex-1">
                        <i className="fas fa-circle-notch fa-spin text-4xl mb-4 text-[var(--primary)]"></i>
                    </div>
                ) : emailsData.length === 0 ? (
                    <div className="text-center p-16 text-[var(--text-muted)] flex flex-col items-center justify-center flex-1 border border-[var(--glass-border)] rounded-2xl bg-[var(--input-bg)]">
                        <i className="fas fa-envelope-open-text text-5xl mb-4 opacity-50"></i>
                    </div>
                ) : (
                    emailsData.map((email) => {
                        let platformName = email.from;
                        if (platformName.includes('<')) platformName = platformName.split('<')[0].replace(/"/g, '').trim();
                        else platformName = platformName.split('@')[0];
                        let pureEmail = email.from;
                        const emailMatch = pureEmail.match(/<([^>]+)>/);
                        if (emailMatch) pureEmail = emailMatch[1];
                        const isExpanded = expandedEmailId === email.id;

                        return (
                            <div key={email.id} className={`bg-[var(--inner-bg)] border ${isExpanded ? 'border-[var(--primary)] shadow-[0_0_15px_rgba(56,189,248,0.15)]' : 'border-[var(--glass-border)] hover:border-[rgba(255,255,255,0.3)]'} rounded-2xl overflow-hidden transition-all duration-300`}>
                                <div 
                                    className="p-5 cursor-pointer hover:bg-[var(--hover-bg)] transition-colors flex flex-col gap-3"
                                    onClick={() => setExpandedEmailId(isExpanded ? null : email.id)}
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <h4 className={`font-bold text-lg ${isExpanded ? 'text-[var(--primary)]' : 'text-[var(--text-main)]'}`}>{email.subject || "بدون عنوان"}</h4>
                                        <div className="flex items-center gap-4 shrink-0">
                                            <button onClick={(e) => { e.stopPropagation(); setConfirmDialog({ isOpen: true, message: 'تأكيد حذف الرسالة؟', onConfirm: () => database.ref(`emails/${email.id}`).remove() }); }} className="text-[var(--text-muted)] hover:text-[var(--error)] transition-colors p-1" title="حذف الرسالة">
                                                <i className="fas fa-trash-alt text-sm"></i>
                                            </button>
                                            <i className={`fas fa-chevron-down text-[var(--text-muted)] text-sm transition-transform duration-300 mt-1 ${isExpanded ? 'rotate-180 text-[var(--primary)]' : ''}`}></i>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm bg-[var(--input-bg)] p-3 rounded-xl border border-[var(--glass-border)]">
                                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                            <span className="text-[var(--text-main)] font-semibold bg-[rgba(255,255,255,0.05)] px-3 py-1 rounded-lg border border-[var(--glass-border)] text-sm">{platformName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[var(--text-muted)] border-r border-[var(--glass-border)] pr-4">
                                            <span className="text-[var(--text-main)] text-sm" dir="ltr">{email.to}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[var(--text-muted)] mr-auto">
                                            <i className="far fa-clock text-sm"></i>
                                            <span className="text-[var(--primary)] text-sm font-bold">{timeAgoFormatter(email.date)}</span>
                                        </div>
                                    </div>
                                </div>
                                {isExpanded && (
                                    <div className="p-6 border-t border-[var(--glass-border)] bg-[rgba(0,0,0,0.4)] animate-fadeIn">
                                        <iframe 
                                            srcDoc={`<base target='_blank'>${email.body || ""}`}
                                            sandbox="allow-same-origin allow-popups"
                                            className="w-full h-[600px] bg-white rounded-xl border-none shadow-inner"
                                        ></iframe>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
};