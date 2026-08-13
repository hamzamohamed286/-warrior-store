const Requests = (props) => {
    const { filterData, requests, accounts, settings, calculateProgress, formatRemainingTime, handleWhatsApp, handleCopy, generateAndShareSummary, handleDuplicate, openModal, handleDelete } = props;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filterData(requests).map((item) => {
                const subProg = calculateProgress(item.startDate, item.endDate);
                let warProg = { expired: false, percent: 0, remaining: 0 };
                let warEndStr = '';
                
                const startD = new Date(item.startDate);
                let warEndD = new Date(startD.getTime());
                if (item.warrantyUnit === 'months') {
                    warEndD.setMonth(warEndD.getMonth() + parseInt(item.warrantyVal || 0));
                } else {
                    warEndD.setDate(warEndD.getDate() + parseInt(item.warrantyVal || 0));
                }
                warEndStr = warEndD.toISOString().split('T')[0];
                warProg = calculateProgress(item.startDate, warEndStr);
                
                const reqAccount = item.accountId && item.accountId !== '-' ? accounts.find(a => a.id === item.accountId) : null;
                const platformObj = settings.platforms.find(p => p.label === item.platform);
                const platformImg = platformObj?.imageUrl;

                return (
                    <div key={item.id} id={`request-card-${item.id}`} className="bg-[var(--inner-bg)] border border-[var(--glass-border)] rounded-2xl p-4 flex flex-col gap-3 transition-all shadow-sm relative overflow-hidden">
                        
                        <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-2 w-full">
                            <div className="flex items-center gap-2">
                                {item.phoneNumber && item.phoneNumber !== '-' && (
                                    <>
                                        <button onClick={() => handleWhatsApp(item.phoneNumber)} className="text-[#25D366] transition-colors hover:scale-110"><i className="fab fa-whatsapp text-[15px]"></i></button>
                                        <button onClick={() => handleCopy(item.phoneNumber)} className="text-[var(--text-muted)] hover:text-white transition-colors hover:scale-110"><i className="fas fa-copy text-sm"></i></button>
                                    </>
                                )}
                            </div>
                            <div className="text-[14px] font-bold text-white text-left" dir="ltr">{item.phoneNumber || '-'}</div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap mt-1">
                            {platformImg ? <img src={platformImg} alt={item.platform} className="w-6 h-6 rounded-md object-cover border border-[var(--glass-border)]" /> : <i className="fas fa-tv text-[var(--primary)] text-base"></i>}
                            <span className="font-bold text-[var(--text-main)] text-[15px]">{item.platform || '-'}</span>
                            {item.plan && item.plan !== '-' && <span className="bg-[rgba(56,189,248,0.15)] text-[var(--primary)] px-2 py-0.5 rounded text-[11px] font-bold">{item.plan}</span>}
                            {item.subscriptionType && item.subscriptionType !== '-' && <span className="bg-[rgba(245,158,11,0.15)] text-[var(--warning)] px-2 py-0.5 rounded text-[11px] font-bold">{item.subscriptionType}</span>}
                            {item.durationLabel && item.durationLabel !== '-' && <span className="bg-[rgba(16,185,129,0.15)] text-[var(--success)] px-2 py-0.5 rounded text-[11px] font-bold">{item.durationLabel}</span>}
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap border-t border-[var(--glass-border)] pt-2 mt-1">
                            
                            {item.amountPaid > 0 && (
                                <span className="bg-[rgba(255,255,255,0.15)] text-white px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5" title="المبلغ">
                                    <i className="fas fa-money-bill-wave opacity-70 text-[10px]"></i>
                                    <span className="mt-0.5">{item.amountPaid} ريال</span>
                                </span>
                            )}

                            <span className="bg-[rgba(255,255,255,0.15)] text-white px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5" title="تاريخ البدء">
                                <i className="far fa-calendar-plus opacity-70 text-[10px]"></i>
                                <span className="mt-0.5">{item.startDate}</span>
                            </span>
                            <span className="bg-[rgba(255,255,255,0.15)] text-white px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5" title="تاريخ الانتهاء">
                                <i className="far fa-calendar-check opacity-70 text-[10px]"></i>
                                <span className="mt-0.5">{item.endDate}</span>
                            </span>
                            
                            {reqAccount && reqAccount.email && reqAccount.email !== '-' && (
                                <span className="bg-[rgba(255,255,255,0.15)] text-white px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5" dir="ltr" title="اسم المستخدم">
                                    <i className="far fa-user opacity-70 text-[10px]"></i>
                                    <span className="truncate max-w-[130px] mt-0.5">{reqAccount.email}</span>
                                </span>
                            )}
                            {item.profileName && item.profileName !== '-' && (
                                <span className="bg-[rgba(255,255,255,0.15)] text-white px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5" dir="rtl" title="اسم الملف">
                                    <i className="far fa-user-circle opacity-70 text-[10px]"></i>
                                    <span className="truncate max-w-[80px] mt-0.5">{item.profileName}</span>
                                </span>
                            )}
                            {item.profilePin && item.profilePin !== '-' && (
                                <span className="bg-[rgba(255,255,255,0.15)] text-white px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5" dir="ltr" title="رمز الملف">
                                    <i className="fas fa-lock opacity-70 text-[9px]"></i>
                                    <span className="mt-0.5">{item.profilePin}</span>
                                </span>
                            )}
                        </div>

                        <div className="flex gap-2 mt-auto pt-1 w-full">
                            <div className="flex-1 bg-[rgba(0,0,0,0.5)] rounded-md h-6 relative overflow-hidden flex items-center justify-center border border-[var(--glass-border)] shadow-inner" title="المدة المتبقية">
                                <div className={`absolute top-0 right-0 h-full ${subProg.expired ? 'bg-[var(--error)]' : 'bg-[var(--primary)]'} transition-all duration-500 opacity-60`} style={{width: `${subProg.percent}%`}}></div>
                                <span className="relative z-10 text-white font-bold text-[10px] drop-shadow-md tracking-wide flex items-center gap-1.5">
                                    <i className="far fa-clock text-[10px]"></i>
                                    <span className="mt-0.5">{subProg.expired ? 'منتهي' : formatRemainingTime(subProg.remaining).replace('متبقي ', '')}</span>
                                </span>
                            </div>

                            {item.warrantyVal > 0 && (
                                <div className="flex-1 bg-[rgba(0,0,0,0.5)] rounded-md h-6 relative overflow-hidden flex items-center justify-center border border-[var(--glass-border)] shadow-inner" title="الضمان المتبقي">
                                    <div className={`absolute top-0 right-0 h-full ${warProg.expired ? 'bg-[var(--error)]' : 'bg-[var(--success)]'} transition-all duration-500 opacity-60`} style={{width: `${warProg.percent}%`}}></div>
                                    <span className="relative z-10 text-white font-bold text-[10px] drop-shadow-md tracking-wide flex items-center gap-1.5">
                                        <i className="fas fa-shield-alt text-[10px]"></i>
                                        <span className="mt-0.5">{warProg.expired ? 'منتهي' : formatRemainingTime(warProg.remaining).replace('متبقي ', '')}</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-2 pt-3 mt-1 border-t border-[var(--glass-border)]">
                            
                            <button onClick={() => generateAndShareSummary(item)} title="نسخ ومشاركة رسالة التسليم" className="w-9 h-9 flex items-center justify-center text-[var(--text-muted)] hover:text-white bg-[var(--input-bg)] hover:bg-[#25D366] rounded-xl transition-all shadow-sm"><i className="fab fa-whatsapp text-sm"></i></button>
                            <button onClick={() => handleDuplicate(item)} title="تكرار الطلب" className="w-9 h-9 flex items-center justify-center text-[var(--text-muted)] hover:text-white bg-[var(--input-bg)] hover:bg-[var(--warning)] rounded-xl transition-all shadow-sm"><i className="fas fa-copy text-sm"></i></button>
                            <button onClick={() => openModal('edit', item)} title="تعديل الطلب" className="w-9 h-9 flex items-center justify-center text-[var(--text-muted)] hover:text-white bg-[var(--input-bg)] hover:bg-[var(--primary)] rounded-xl transition-all shadow-sm"><i className="fas fa-edit text-sm"></i></button>
                            <button onClick={() => handleDelete(item.id)} title="حذف الطلب" className="w-9 h-9 flex items-center justify-center text-[var(--text-muted)] hover:text-white bg-[var(--input-bg)] hover:bg-[var(--error)] rounded-xl transition-all shadow-sm"><i className="fas fa-trash-alt text-sm"></i></button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};