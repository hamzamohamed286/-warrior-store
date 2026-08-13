const Accounts = (props) => {
    const { filterData, accounts, settings, calculateProgress, formatRemainingTime, handleCopy, handleDuplicate, openModal, handleDelete } = props;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filterData(accounts).map((item) => {
                const subProg = calculateProgress(item.startDate, item.endDate);
                const platformObj = settings.platforms.find(p => p.label === item.platform);
                const platformImg = platformObj?.imageUrl;

                return (
                    <div key={item.id} className="bg-[var(--inner-bg)] border border-[var(--glass-border)] rounded-2xl p-4 flex flex-col gap-3 transition-all shadow-sm relative overflow-hidden">
                        
                        <div className="flex items-center gap-2 flex-wrap mt-1 border-b border-[var(--glass-border)] pb-3">
                            {platformImg ? <img src={platformImg} alt={item.platform} className="w-6 h-6 rounded-md object-cover border border-[var(--glass-border)]" /> : <i className="fas fa-tv text-[var(--primary)] text-base"></i>}
                            <span className="font-bold text-[var(--text-main)] text-[15px]">{item.platform || '-'}</span>
                            {item.plan && item.plan !== '-' && <span className="bg-[rgba(56,189,248,0.15)] text-[var(--primary)] px-2 py-0.5 rounded text-[11px] font-bold">{item.plan}</span>}
                        </div>
                        
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            <span className="bg-[rgba(255,255,255,0.15)] text-white px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5" title="تاريخ البدء">
                                <i className="far fa-calendar-plus opacity-70 text-[10px]"></i>
                                <span className="mt-0.5">{item.startDate}</span>
                            </span>
                            <span className="bg-[rgba(255,255,255,0.15)] text-white px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5" title="تاريخ الانتهاء">
                                <i className="far fa-calendar-check opacity-70 text-[10px]"></i>
                                <span className="mt-0.5">{item.endDate}</span>
                            </span>
                            
                            {item.email && item.email !== '-' && (
                                <span className="bg-[rgba(255,255,255,0.15)] text-white px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[var(--primary)] transition-colors" dir="ltr" title="نسخ اسم المستخدم" onClick={() => handleCopy(item.email)}>
                                    <i className="far fa-user opacity-70 text-[10px]"></i>
                                    <span className="truncate max-w-[130px] mt-0.5">{item.email}</span>
                                </span>
                            )}
                            {item.password && item.password !== '-' && (
                                <span className="bg-[rgba(255,255,255,0.15)] text-white px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[var(--primary)] transition-colors" dir="ltr" title="نسخ كلمة المرور" onClick={() => handleCopy(item.password)}>
                                    <i className="fas fa-lock opacity-70 text-[9px]"></i>
                                    <span className="mt-0.5">{item.password}</span>
                                </span>
                            )}
                        </div>

                        <div className="w-full bg-[rgba(0,0,0,0.5)] rounded-md h-6 relative overflow-hidden flex items-center justify-center border border-[var(--glass-border)] shadow-inner mt-auto">
                            <div className={`absolute top-0 right-0 h-full ${subProg.expired ? 'bg-[var(--error)]' : 'bg-[var(--primary)]'} transition-all duration-500 opacity-60`} style={{width: `${subProg.percent}%`}}></div>
                            <span className="relative z-10 text-white font-bold text-[10px] drop-shadow-md tracking-wide flex items-center gap-1.5">
                                <i className="far fa-clock text-[10px]"></i>
                                <span className="mt-0.5">{subProg.expired ? 'منتهي' : formatRemainingTime(subProg.remaining).replace('متبقي ', '')}</span>
                            </span>
                        </div>

                        <div className="flex items-center justify-center gap-2 pt-3 mt-1 border-t border-[var(--glass-border)]">
                            <button onClick={() => handleDuplicate(item)} title="تكرار الحساب" className="w-9 h-9 flex items-center justify-center text-[var(--text-muted)] hover:text-white bg-[var(--input-bg)] hover:bg-[var(--warning)] rounded-xl transition-all shadow-sm"><i className="fas fa-copy text-sm"></i></button>
                            <button onClick={() => openModal('edit', item)} title="تعديل الحساب" className="w-9 h-9 flex items-center justify-center text-[var(--text-muted)] hover:text-white bg-[var(--input-bg)] hover:bg-[var(--primary)] rounded-xl transition-all shadow-sm"><i className="fas fa-edit text-sm"></i></button>
                            <button onClick={() => handleDelete(item.id)} title="حذف الحساب" className="w-9 h-9 flex items-center justify-center text-[var(--text-muted)] hover:text-white bg-[var(--input-bg)] hover:bg-[var(--error)] rounded-xl transition-all shadow-sm"><i className="fas fa-trash-alt text-sm"></i></button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};