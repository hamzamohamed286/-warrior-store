const Settings = (props) => {
    const {
        settingsTab, setSettingsTab, settings, selectedPlatformId, setSelectedPlatformId,
        selectedPlanId, setSelectedPlanId, selectedTypeId, setSelectedTypeId,
        selectedDurationId, setSelectedDurationId, editTarget, handleAddOrEditSetting,
        newPlatformName, setNewPlatformName, newPlatformUrl, setNewPlatformUrl,
        handleCancelEdit, handleDeleteSetting, handleEditClick, handleReorderSetting,
        selectedSettingPlatform, newPlanName, setNewPlanName, selectedSettingPlan,
        newTypeName, setNewTypeName, handleAddOrEditDuration, newDurLabel, setNewDurLabel,
        newDurVal, setNewDurVal, newDurUnit, setNewDurUnit, newWarVal, setNewWarVal,
        newWarUnit, setNewWarUnit, selectedSettingType, isCombSelected, displayReqs,
        currentReqConfig, handleToggleRequirement, handleReorderRequirement, localDeliveryMsg,
        setLocalDeliveryMsg, updateLocalMessage, insertVarToLocalMessage, localDeliveryMsgRef,
        newCredEmail, setNewCredEmail, newCredPass, setNewCredPass, emailCreds, setConfirmDialog, database
    } = props;

    return (
        <div className="flex flex-col space-y-6 pb-10">
            <div className="flex gap-3 admin-panel p-3 rounded-2xl flex-wrap">
                <button 
                    onClick={() => setSettingsTab('platforms')} 
                    className={`flex-1 md:flex-none px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${settingsTab === 'platforms' ? 'bg-gradient-to-l from-[var(--primary)] to-[var(--primary-hover)] text-white shadow-[0_4px_15px_rgba(56,189,248,0.3)]' : 'hover:bg-[var(--hover-bg)] text-[var(--text-muted)]'}`}
                >
                    <i className="fas fa-layer-group ml-2 text-sm"></i> المنصات والأنواع
                </button>
                <button 
                    onClick={() => setSettingsTab('connected_emails')} 
                    className={`flex-1 md:flex-none px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${settingsTab === 'connected_emails' ? 'bg-gradient-to-l from-[var(--primary)] to-[var(--primary-hover)] text-white shadow-[0_4px_15px_rgba(56,189,248,0.3)]' : 'hover:bg-[var(--hover-bg)] text-[var(--text-muted)]'}`}
                >
                    <i className="fas fa-link ml-2 text-sm"></i> ربط الإيميلات
                </button>
            </div>

            {settingsTab === 'platforms' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        
                        <div className="admin-panel p-6 rounded-3xl flex flex-col h-[450px]">
                            <form onSubmit={e => handleAddOrEditSetting(e, 'platforms', {})} className="flex flex-col gap-3 mb-5 shrink-0 border-b border-[var(--glass-border)] pb-4">
                                <input type="text" placeholder="المنصة" required value={newPlatformName} onChange={e => setNewPlatformName(e.target.value)} className={`w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-main)] rounded-xl px-3 outline-none focus:border-[var(--primary)] transition-colors text-sm focus:shadow-[0_0_10px_rgba(56,189,248,0.2)] h-[48px] font-bold ${editTarget.path === 'platforms' ? 'border-[var(--warning)] bg-[rgba(245,158,11,0.05)]' : ''}`} />
                                <input type="url" dir="ltr" placeholder="رابط" value={newPlatformUrl} onChange={e => setNewPlatformUrl(e.target.value)} className="w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-main)] rounded-xl px-3 outline-none focus:border-[var(--primary)] transition-colors text-sm focus:shadow-[0_0_10px_rgba(56,189,248,0.2)] text-left h-[48px] font-bold" />
                                <div className="flex gap-2">
                                    <button type="submit" className={`flex-1 text-white p-3 rounded-xl transition-all shadow-md font-bold text-sm flex items-center justify-center h-[48px] ${editTarget.path === 'platforms' ? 'bg-gradient-to-l from-[var(--warning)] to-[var(--warning)] hover:-translate-y-0.5' : 'bg-gradient-to-l from-[var(--primary)] to-[var(--primary-hover)] hover:-translate-y-0.5'}`}>
                                        {editTarget.path === 'platforms' ? <i className="fas fa-check text-sm"></i> : <i className="fas fa-plus text-sm"></i>}
                                    </button>
                                    {editTarget.path === 'platforms' && (
                                        <button type="button" onClick={handleCancelEdit} className="bg-[var(--inner-bg)] border border-[var(--glass-border)] hover:bg-[var(--error)] hover:text-white transition-all rounded-xl px-5 text-sm font-bold shadow-md flex items-center justify-center h-[48px]"><i className="fas fa-times text-sm"></i></button>
                                    )}
                                </div>
                            </form>
                            <div className="flex-1 overflow-y-auto pr-2 space-y-1">
                                {settings.platforms.map((item) => (
                                    <SettingListItem 
                                        key={item.id} item={item} path="platforms" onDelete={handleDeleteSetting} onEditClick={handleEditClick} onReorder={handleReorderSetting}
                                        isSelected={selectedPlatformId === item.id} 
                                        isBeingEdited={editTarget.id === item.id && editTarget.path === 'platforms'}
                                        onClick={() => { 
                                            setSelectedPlatformId(item.id); 
                                            setSelectedPlanId(null); 
                                            setSelectedTypeId(null); 
                                            setSelectedDurationId(null);
                                            handleCancelEdit();
                                        }} 
                                    />
                                ))}
                            </div>
                        </div>

                        <div className={`admin-panel p-6 rounded-3xl flex flex-col h-[450px] transition-all duration-500 ${selectedPlatformId ? 'opacity-100 scale-100' : 'opacity-40 scale-95 pointer-events-none'}`}>
                            <form onSubmit={e => handleAddOrEditSetting(e, 'plans', { platformName: selectedSettingPlatform, platformId: selectedPlatformId })} className="flex flex-col gap-3 mb-5 shrink-0 border-b border-[var(--glass-border)] pb-4">
                                <input type="text" placeholder="الخطة" required value={newPlanName} onChange={e => setNewPlanName(e.target.value)} disabled={!selectedPlatformId} className={`w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-main)] rounded-xl px-3 outline-none focus:border-[var(--primary)] transition-colors text-sm disabled:opacity-50 focus:shadow-[0_0_10px_rgba(56,189,248,0.2)] h-[48px] font-bold ${editTarget.path === 'plans' ? 'border-[var(--warning)] bg-[rgba(245,158,11,0.05)]' : ''}`} />
                                <div className="flex gap-2">
                                    <button type="submit" disabled={!selectedPlatformId} className={`flex-1 text-white p-3 rounded-xl transition-all disabled:opacity-50 shadow-md flex items-center justify-center h-[48px] text-sm ${editTarget.path === 'plans' ? 'bg-gradient-to-l from-[var(--warning)] to-[var(--warning)] hover:-translate-y-0.5' : 'bg-gradient-to-l from-[var(--primary)] to-[var(--primary-hover)] hover:-translate-y-0.5'}`}>
                                        {editTarget.path === 'plans' ? <i className="fas fa-check text-sm"></i> : <i className="fas fa-plus text-sm"></i>}
                                    </button>
                                    {editTarget.path === 'plans' && (
                                        <button type="button" onClick={handleCancelEdit} className="bg-[var(--inner-bg)] border border-[var(--glass-border)] hover:bg-[var(--error)] hover:text-white transition-all rounded-xl px-5 text-sm font-bold shadow-md flex items-center justify-center h-[48px]"><i className="fas fa-times text-sm"></i></button>
                                    )}
                                </div>
                            </form>
                            <div className="flex-1 overflow-y-auto pr-2 space-y-1">
                                {settings.plans.filter(p => p.platformId ? p.platformId === selectedPlatformId : p.platformName === selectedSettingPlatform).map((item) => (
                                    <SettingListItem 
                                        key={item.id} item={item} path="plans" onDelete={handleDeleteSetting} onEditClick={handleEditClick} onReorder={handleReorderSetting}
                                        isSelected={selectedPlanId === item.id} 
                                        isBeingEdited={editTarget.id === item.id && editTarget.path === 'plans'}
                                        onClick={() => {
                                            setSelectedPlanId(item.id);
                                            setSelectedTypeId(null);
                                            setSelectedDurationId(null);
                                            handleCancelEdit();
                                        }} 
                                    />
                                ))}
                            </div>
                        </div>

                        <div className={`admin-panel p-6 rounded-3xl flex flex-col h-[450px] transition-all duration-500 ${selectedPlanId ? 'opacity-100 scale-100' : 'opacity-40 scale-95 pointer-events-none'}`}>
                            <form onSubmit={e => handleAddOrEditSetting(e, 'subscriptionTypes', { planName: selectedSettingPlan, planId: selectedPlanId, platformName: selectedSettingPlatform, platformId: selectedPlatformId })} className="flex flex-col gap-3 mb-5 shrink-0 relative z-[50] border-b border-[var(--glass-border)] pb-4">
                                <input 
                                    type="text" 
                                    placeholder="النوع" 
                                    required 
                                    value={newTypeName} 
                                    onChange={e => setNewTypeName(e.target.value)} 
                                    disabled={!selectedPlanId} 
                                    className={`w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-main)] rounded-xl px-3 outline-none focus:border-[var(--primary)] transition-colors text-sm disabled:opacity-50 focus:shadow-[0_0_10px_rgba(56,189,248,0.2)] h-[48px] font-bold ${editTarget.path === 'subscriptionTypes' ? 'border-[var(--warning)] bg-[rgba(245,158,11,0.05)]' : ''}`} 
                                />
                                <div className="flex gap-2">
                                    <button type="submit" disabled={!selectedPlanId} className={`flex-1 text-white p-3 rounded-xl transition-all disabled:opacity-50 shadow-md flex items-center justify-center h-[48px] text-sm ${editTarget.path === 'subscriptionTypes' ? 'bg-gradient-to-l from-[var(--warning)] to-[var(--warning)] hover:-translate-y-0.5' : 'bg-gradient-to-l from-[var(--primary)] to-[var(--primary-hover)] hover:-translate-y-0.5'}`}>
                                        {editTarget.path === 'subscriptionTypes' ? <i className="fas fa-check text-sm"></i> : <i className="fas fa-plus text-sm"></i>}
                                    </button>
                                    {editTarget.path === 'subscriptionTypes' && (
                                        <button type="button" onClick={handleCancelEdit} className="bg-[var(--inner-bg)] border border-[var(--glass-border)] hover:bg-[var(--error)] hover:text-white transition-all rounded-xl px-5 text-sm font-bold shadow-md flex items-center justify-center h-[48px]"><i className="fas fa-times text-sm"></i></button>
                                    )}
                                </div>
                            </form>
                            <div className="flex-1 overflow-y-auto pr-2 space-y-1 relative z-10">
                                {settings.subTypes.filter(s => s.planId ? s.planId === selectedPlanId : (s.planName === selectedSettingPlan && s.platformName === selectedSettingPlatform)).map((item) => (
                                    <SettingListItem 
                                        key={item.id} item={item} path="subscriptionTypes" onDelete={handleDeleteSetting} onEditClick={handleEditClick} onReorder={handleReorderSetting}
                                        isSelected={selectedTypeId === item.id}
                                        isBeingEdited={editTarget.id === item.id && editTarget.path === 'subscriptionTypes'} 
                                        onClick={() => {
                                            setSelectedTypeId(item.id);
                                            setSelectedDurationId(null);
                                            handleCancelEdit();
                                        }} 
                                    />
                                ))}
                            </div>
                        </div>

                        <div className={`admin-panel p-6 rounded-3xl flex flex-col h-[450px] transition-all duration-500 ${selectedTypeId ? 'opacity-100 scale-100' : 'opacity-40 scale-95 pointer-events-none'}`}>
                            <form onSubmit={handleAddOrEditDuration} className="flex flex-col gap-3 mb-5 shrink-0 relative z-[50] border-b border-[var(--glass-border)] pb-4">
                                <input type="text" placeholder="المدة" required value={newDurLabel} onChange={e=>setNewDurLabel(e.target.value)} disabled={!selectedTypeId} className={`w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-main)] rounded-xl px-3 outline-none focus:border-[var(--primary)] transition-colors text-sm focus:shadow-[0_0_10px_rgba(56,189,248,0.2)] h-[48px] font-bold ${editTarget.path === 'durations' ? 'border-[var(--warning)] bg-[rgba(245,158,11,0.05)]' : ''}`} />
                                
                                <div className="flex items-center bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl focus-within:border-[var(--primary)] focus-within:shadow-[0_0_10px_rgba(56,189,248,0.2)] transition-colors h-[48px] relative z-[60]">
                                    <input type="number" min="0" placeholder="قيمة المدة" value={newDurVal} onChange={e=>setNewDurVal(e.target.value)} disabled={!selectedTypeId} className="flex-1 bg-transparent text-[var(--text-main)] px-3 outline-none text-center text-sm font-bold min-w-0 rounded-r-xl h-full" />
                                    <div className="w-[100px] h-full border-r border-[var(--glass-border)] shrink-0 flex items-center">
                                        <CustomSelect 
                                            options={[{label:'أيام',value:'days'},{label:'أشهر',value:'months'}]} 
                                            value={newDurUnit} 
                                            onChange={setNewDurUnit} 
                                            disabled={!selectedTypeId} 
                                            customClass="h-full px-3 border-none rounded-none rounded-l-xl bg-transparent text-sm font-bold" 
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl focus-within:border-[var(--primary)] focus-within:shadow-[0_0_10px_rgba(56,189,248,0.2)] transition-colors h-[48px] relative z-[50]">
                                    <input type="number" min="0" placeholder="قيمة الضمان" value={newWarVal} onChange={e=>setNewWarVal(e.target.value)} disabled={!selectedTypeId} className="flex-1 bg-transparent text-[var(--text-main)] px-3 outline-none text-center text-sm font-bold min-w-0 rounded-r-xl h-full" />
                                    <div className="w-[100px] h-full border-r border-[var(--glass-border)] shrink-0 flex items-center">
                                        <CustomSelect 
                                            options={[{label:'أيام',value:'days'},{label:'أشهر',value:'months'}]} 
                                            value={newWarUnit} 
                                            onChange={setNewWarUnit} 
                                            disabled={!selectedTypeId} 
                                            customClass="h-full px-3 border-none rounded-none rounded-l-xl bg-transparent text-sm font-bold" 
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button type="submit" disabled={!selectedTypeId} className={`flex-1 text-white p-3 rounded-xl transition-all shadow-md font-bold text-sm disabled:opacity-50 flex items-center justify-center h-[48px] text-sm ${editTarget.path === 'durations' ? 'bg-gradient-to-l from-[var(--warning)] to-[var(--warning)] hover:-translate-y-0.5' : 'bg-gradient-to-l from-[var(--primary)] to-[var(--primary-hover)] hover:-translate-y-0.5'}`}>
                                        {editTarget.path === 'durations' ? <i className="fas fa-check text-sm"></i> : <i className="fas fa-plus text-sm"></i>}
                                    </button>
                                    {editTarget.path === 'durations' && (
                                        <button type="button" onClick={handleCancelEdit} className="bg-[var(--inner-bg)] border border-[var(--glass-border)] hover:bg-[var(--error)] hover:text-white transition-all rounded-xl px-5 text-sm font-bold shadow-md flex items-center justify-center h-[48px]"><i className="fas fa-times text-sm"></i></button>
                                    )}
                                </div>
                            </form>
                            <div className="flex-1 overflow-y-auto pr-2 space-y-1 relative z-10">
                                {settings.durations.filter(d => d.typeId ? d.typeId === selectedTypeId : (d.typeName === selectedSettingType && d.planName === selectedSettingPlan && d.platformName === selectedSettingPlatform)).map((item) => (
                                    <SettingListItem 
                                        key={item.id} item={item} path="durations" onDelete={handleDeleteSetting} onEditClick={handleEditClick} onReorder={handleReorderSetting}
                                        isSelected={selectedDurationId === item.id} 
                                        isBeingEdited={editTarget.id === item.id && editTarget.path === 'durations'}
                                        onClick={() => {
                                            setSelectedDurationId(item.id);
                                            handleCancelEdit();
                                        }} 
                                    />
                                ))}
                            </div>
                        </div>

                    </div>

                    <div className={`mt-6 transition-all duration-500 ${isCombSelected ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 admin-panel p-6 rounded-3xl flex flex-col gap-4">
                                <div className="flex flex-col gap-3">
                                    {displayReqs.map((req) => (
                                        <CombToggle 
                                            key={req.id}
                                            id={req.id}
                                            disabled={!isCombSelected} 
                                            icon={req.icon} 
                                            label={req.label} 
                                            checked={currentReqConfig[req.id]} 
                                            onChange={val => handleToggleRequirement(req.id, val)} 
                                            onReorder={handleReorderRequirement}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-2 admin-panel p-6 rounded-3xl flex flex-col gap-4">
                                <div className="flex flex-col bg-[var(--inner-bg)] p-5 rounded-2xl border border-[var(--glass-border)] relative flex-1">
                                    <div className="flex flex-wrap gap-1.5 mb-3 bg-[var(--input-bg)] p-3 rounded-xl border border-[var(--glass-border)]">
                                        {['[المنصة]', '[الخطة]', '[النوع]', '[المدة]', '[اسم_المستخدم]', '[كلمة_المرور]', '[اسم_الملف]', '[رمز_الملف]', '[تاريخ_البدء]', '[تاريخ_الانتهاء]', '[تاريخ_انتهاء_الضمان]'].map(v => (
                                            <button 
                                                key={v} 
                                                onClick={() => insertVarToLocalMessage(v)} 
                                                className="bg-[rgba(56,189,248,0.1)] hover:bg-[var(--primary)] text-[var(--primary)] hover:text-white border border-[rgba(56,189,248,0.3)] px-2 py-1 rounded-lg text-xs font-bold transition-all duration-300 shadow-sm" 
                                                dir="ltr"
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea 
                                        ref={localDeliveryMsgRef}
                                        value={localDeliveryMsg}
                                        onChange={(e) => setLocalDeliveryMsg(e.target.value)}
                                        onBlur={(e) => updateLocalMessage(e.target.value)}
                                        placeholder="اكتب رسالة التسليم التي ستنسخ للعميل لهذا الاشتراك التحديداً... المتغيرات بالأعلى، التغييرات تحفظ تلقائياً عند الخروج من المربع."
                                        className="w-full flex-1 bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-main)] rounded-xl p-4 outline-none focus:border-[var(--primary)] focus:shadow-[0_0_15px_rgba(56,189,248,0.1)] text-sm resize-none min-h-[160px] font-sans leading-relaxed transition-all"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}

            {settingsTab === 'connected_emails' && (
                <div className="admin-panel p-8 rounded-3xl flex flex-col animate-fadeIn max-w-4xl mx-auto">
                    <h3 className="text-xl font-bold text-[var(--text-main)] mb-6 pb-4 border-b border-[var(--glass-border)] flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[rgba(56,189,248,0.15)] flex items-center justify-center border border-[rgba(56,189,248,0.3)]">
                            <i className="fas fa-plug text-[var(--primary)] text-xl"></i>
                        </div>
                        إدارة الإيميلات المستمعة لحظياً
                    </h3>
                    
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if(newCredEmail && newCredPass) {
                            database.ref('email_credentials').push({ email: newCredEmail, password: newCredPass });
                            setNewCredEmail(''); setNewCredPass('');
                        }
                    }} className="flex flex-wrap gap-4 mb-8 bg-[var(--inner-bg)] p-5 rounded-2xl border border-[var(--glass-border)]">
                        <div className="flex-1 min-w-[250px]">
                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">الإيميل</label>
                            <input type="email" required dir="ltr" value={newCredEmail} onChange={e => setNewCredEmail(e.target.value)} className="w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-main)] rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] text-sm text-left" placeholder="example@gmail.com" />
                        </div>
                        <div className="flex-1 min-w-[250px]">
                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">كلمة مرور التطبيقات</label>
                            <input type="text" required dir="ltr" value={newCredPass} onChange={e => setNewCredPass(e.target.value)} className="w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-main)] rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] text-sm text-left" placeholder="xxxx xxxx xxxx xxxx" />
                        </div>
                        <div className="w-full flex justify-end mt-2">
                            <button type="submit" className="bg-gradient-to-l from-[var(--primary)] to-[var(--primary-hover)] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2">
                                <i className="fas fa-plus"></i> إضافة وربط
                            </button>
                        </div>
                    </form>

                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[var(--text-muted)] mb-3">الإيميلات النشطة ({emailCreds.length})</h4>
                        {emailCreds.length === 0 ? (
                            <div className="text-center p-8 text-[var(--text-muted)] bg-[var(--input-bg)] rounded-xl border border-[var(--glass-border)]">لا توجد إيميلات مربوطة حالياً.</div>
                        ) : (
                            emailCreds.map(cred => (
                                <div key={cred.id} className="flex justify-between items-center bg-[var(--inner-bg)] border border-[var(--glass-border)] p-4 rounded-xl hover:border-[var(--primary)] transition-all">
                                    <div className="flex items-center gap-4">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--success)]"></span>
                                        </span>
                                        <span className="text-sm font-bold text-[var(--text-main)]" dir="ltr">{cred.email}</span>
                                    </div>
                                    <button onClick={() => setConfirmDialog({ isOpen: true, message: 'هل أنت متأكد من فك ارتباط هذا الإيميل؟', onConfirm: () => database.ref(`email_credentials/${cred.id}`).remove() })} className="text-[var(--text-muted)] hover:text-[var(--error)] transition-colors p-2 bg-[var(--input-bg)] hover:bg-[rgba(239,68,68,0.1)] rounded-lg">
                                        <i className="fas fa-unlink text-sm"></i>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};