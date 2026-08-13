const { BrowserRouter, Switch, Route, Link, useLocation, Redirect } = window.ReactRouterDOM;

window.globalDraggedSettingId = null;
window.globalDraggedReqId = null;

window.formatRemainingTime = (totalDays) => {
    if (totalDays <= 0) return 'منتهي';
    let y = Math.floor(totalDays / 365); let m = Math.floor((totalDays % 365) / 30); let d = Math.floor((totalDays % 365) % 30);
    let yStr = y === 1 ? 'سنة' : y === 2 ? 'سنتين' : y >= 3 && y <= 10 ? `${y} سنوات` : y > 10 ? `${y} سنة` : '';
    let mStr = m === 1 ? 'شهر' : m === 2 ? 'شهرين' : m >= 3 && m <= 10 ? `${m} أشهر` : m > 10 ? `${m} شهر` : '';
    let dStr = d === 1 ? 'يوم' : d === 2 ? 'يومين' : d >= 3 && d <= 10 ? `${d} أيام` : d > 10 ? `${d} يوم` : '';
    let parts = [yStr, mStr, dStr].filter(Boolean); return `متبقي ${parts.join(' و ')}`;
};

window.calculateProgress = (startDateStr, endDateStr, durationDaysFallback) => {
    if (!startDateStr) return { remaining: 0, percent: 0, expired: true };
    const startDate = new Date(startDateStr); let endDate;
    if (endDateStr) { endDate = new Date(endDateStr); } else if (durationDaysFallback) { endDate = new Date(startDate.getTime() + (parseInt(durationDaysFallback) * 24 * 60 * 60 * 1000)); } else { return { remaining: 0, percent: 0, expired: true }; }
    const today = new Date(); const diffTime = endDate - today; const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalDiff = endDate - startDate; const totalDays = Math.ceil(totalDiff / (1000 * 60 * 60 * 24));
    if (remainingDays <= 0) return { remaining: 0, percent: 0, expired: true };
    const percent = totalDays > 0 ? Math.min(100, Math.max(0, (remainingDays / totalDays) * 100)) : 0;
    return { remaining: remainingDays, percent, expired: false };
};

window.getCombId = (platformId, planId, typeId, durationId) => { return `${platformId || 'null'}___${planId || 'null'}___${typeId || 'null'}___${durationId || 'null'}`; };

window.CustomSelect = ({ options, value, onChange, placeholder = "", required, disabled = false, customClass = "p-2.5" }) => {
    const [isOpen, setIsOpen] = React.useState(false); const selectRef = React.useRef(null);
    React.useEffect(() => { const handleClickOutside = (event) => { if (selectRef.current && !selectRef.current.contains(event.target)) setIsOpen(false); }; document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside); }, []);
    const selectedLabel = value ? options.find(o => String(o.value) === String(value))?.label : placeholder;
    return (
        <div className={`relative w-full h-full ${isOpen ? 'z-[9999]' : 'z-10'}`} ref={selectRef}>
            {required && <input type="text" required value={value || ''} onChange={()=>{}} className="absolute opacity-0 w-0 h-0 pointer-events-none" />}
            <div className={`w-full h-full bg-[var(--input-bg)] border ${isOpen ? 'border-[var(--primary)] shadow-[0_0_12px_rgba(56,189,248,0.2)]' : 'border-[var(--glass-border)]'} text-[var(--text-main)] rounded-xl ${customClass} flex justify-between items-center gap-2 transition-all duration-300 box-border ${disabled ? 'opacity-50 cursor-not-allowed bg-[var(--inner-bg)]' : 'cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--hover-bg)]'}`} onClick={() => !disabled && setIsOpen(!isOpen)}>
                <span className={`block flex-1 min-w-0 text-right truncate text-sm ${value && value !== 'all' ? 'text-[var(--text-main)] font-bold' : 'text-[var(--text-muted)]'}`} dir="auto">{selectedLabel || placeholder}</span>
                <i className={`fas fa-chevron-down shrink-0 text-[var(--text-muted)] text-sm transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--primary)]' : ''}`}></i>
            </div>
            {isOpen && !disabled && (
                <div className="absolute left-0 right-0 w-full mt-1 bg-[#1e293b] border border-[var(--glass-border)] rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] overflow-hidden animate-fadeIn top-full text-sm">
                    <div className="max-h-60 overflow-y-auto">
                        {options.length === 0 ? <div className="p-3 text-center text-[var(--text-muted)] text-sm font-bold">لا توجد خيارات</div> : options.map((opt) => (
                            <div key={opt.value} className={`p-3 transition-colors border-b border-[var(--glass-border)] last:border-0 flex items-center justify-between ${opt.disabled ? 'opacity-50 cursor-not-allowed bg-[rgba(0,0,0,0.2)]' : 'cursor-pointer hover:bg-[rgba(255,255,255,0.05)]'} ${String(value) === String(opt.value) && !opt.disabled ? 'bg-[rgba(56,189,248,0.15)] text-[var(--primary)] font-bold' : 'text-[var(--text-main)]'}`} onClick={() => { if(!opt.disabled) { onChange(opt.value); setIsOpen(false); } }}>
                                <span dir="auto" className="truncate text-sm font-bold">{opt.label}</span>
                                {String(value) === String(opt.value) && !opt.disabled && <i className="fas fa-check text-sm text-[var(--primary)] shrink-0 mr-2"></i>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

window.CustomDatePicker = ({ value, onChange, disabled }) => {
    const [isOpen, setIsOpen] = React.useState(false); const [currentDate, setCurrentDate] = React.useState(value ? new Date(value) : new Date()); const pickerRef = React.useRef(null);
    React.useEffect(() => { if (value) setCurrentDate(new Date(value)); }, [value]);
    React.useEffect(() => { const handleClickOutside = (event) => { if (pickerRef.current && !pickerRef.current.contains(event.target)) setIsOpen(false); }; document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside); }, []);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(); const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const handlePrevMonth = (e) => { e.stopPropagation(); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); }; const handleNextMonth = (e) => { e.stopPropagation(); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); };
    const handleDateClick = (day, e) => { e.stopPropagation(); const month = String(currentDate.getMonth() + 1).padStart(2, '0'); const dayStr = String(day).padStart(2, '0'); if (onChange) onChange(`${currentDate.getFullYear()}-${month}-${dayStr}`); setIsOpen(false); };
    return (
        <div className={`relative w-full h-full ${isOpen ? 'z-[9999]' : 'z-10'}`} ref={pickerRef}>
            <div className={`w-full h-full bg-[var(--input-bg)] border ${isOpen ? 'border-[var(--primary)] shadow-[0_0_12px_rgba(56,189,248,0.2)]' : 'border-[var(--glass-border)]'} text-[var(--text-main)] rounded-xl p-3 flex justify-between items-center transition-all duration-300 text-sm ${disabled ? 'opacity-50 cursor-not-allowed bg-[var(--inner-bg)]' : 'cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--hover-bg)]'}`} onClick={() => !disabled && setIsOpen(!isOpen)} dir="ltr">
                <span className="text-sm font-bold">{value || 'YYYY-MM-DD'}</span><i className="fas fa-calendar-alt text-[var(--text-muted)] text-sm"></i>
            </div>
            {isOpen && !disabled && (
                <div className="absolute left-0 right-0 mt-1 p-4 bg-[#1e293b] border border-[var(--glass-border)] rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] animate-fadeIn z-[9999]" dir="ltr">
                    <div className="flex justify-between items-center mb-4">
                        <button type="button" onClick={handlePrevMonth} className="text-[var(--text-muted)] hover:text-white p-1 transition-colors"><i className="fas fa-chevron-left text-sm"></i></button>
                        <span className="font-bold text-[var(--text-main)] text-sm">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                        <button type="button" onClick={handleNextMonth} className="text-[var(--text-muted)] hover:text-white p-1 transition-colors"><i className="fas fa-chevron-right text-sm"></i></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center mb-2 border-b border-[var(--glass-border)] pb-2">{dayNames.map(d => <div key={d} className="text-xs font-bold text-[var(--primary)]">{d}</div>)}</div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1; const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; const isSelected = value === dateStr; const isToday = new Date().toISOString().split('T')[0] === dateStr;
                            return (<button key={day} type="button" onClick={(e) => handleDateClick(day, e)} className={`w-7 h-7 rounded-full text-xs flex items-center justify-center mx-auto transition-all duration-300 ${isSelected ? 'bg-[var(--primary)] text-white font-bold shadow-[0_0_10px_rgba(56,189,248,0.5)] scale-110' : isToday ? 'border border-[var(--primary)] text-[var(--primary)] font-bold' : 'text-[var(--text-main)] hover:bg-[rgba(255,255,255,0.1)] hover:scale-110'}`}>{day}</button>);
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

window.CustomNumberInput = ({ value, onChange, placeholder = "", min = 0 }) => {
    const handleIncrement = () => onChange(String((parseInt(value || 0) + 1))); const handleDecrement = () => onChange(String(Math.max(min, (parseInt(value || 0) - 1))));
    return (
        <div className="flex items-center w-full bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl overflow-hidden focus-within:border-[var(--primary)] transition-all duration-300 focus-within:shadow-[0_0_12px_rgba(56,189,248,0.2)]">
            <button type="button" onClick={handleIncrement} className="px-3 py-2 bg-[var(--inner-bg)] hover:bg-[var(--primary)] hover:text-white transition-colors border-l border-[var(--glass-border)] text-[var(--text-muted)]"><i className="fas fa-plus text-xs"></i></button>
            <input type="number" value={value === 0 ? "0" : (value || '')} onChange={(e) => onChange(e.target.value)} className="w-full text-center bg-transparent text-[var(--text-main)] outline-none font-bold p-1 text-sm" placeholder={placeholder} />
            <button type="button" onClick={handleDecrement} className="px-3 py-2 bg-[var(--inner-bg)] hover:bg-[var(--error)] hover:text-white transition-colors border-r border-[var(--glass-border)] text-[var(--text-muted)]"><i className="fas fa-minus text-xs"></i></button>
        </div>
    );
};

window.CombToggle = ({ id, label, checked, onChange, icon, disabled, onReorder }) => {
    return (
        <div draggable={!disabled} onDragStart={(e) => { window.globalDraggedReqId = id; e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData('text/plain', id); }} onDragEnter={(e) => { e.preventDefault(); if (window.globalDraggedReqId && window.globalDraggedReqId !== id && !disabled) { onReorder(window.globalDraggedReqId, id); } }} onDragOver={(e) => e.preventDefault()} onDragEnd={() => { window.globalDraggedReqId = null; }} className={`flex items-center justify-between p-3 bg-[var(--inner-bg)] border rounded-2xl transition-all shadow-sm group relative ${disabled ? 'opacity-50 border-[var(--glass-border)]' : 'hover:border-[var(--primary)] hover:bg-[var(--input-bg)] border-[var(--glass-border)]'}`}>
            <label className={`flex-1 flex items-center justify-between min-w-0 pl-2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <input type="checkbox" className="hidden" checked={checked || false} onChange={(e) => { if (!disabled) onChange(e.target.checked); }} disabled={disabled} />
                <span className="font-bold text-[var(--text-main)] text-sm flex items-center gap-2 truncate flex-1 pr-1">{icon && <i className={`${icon} text-[var(--text-muted)] ${!disabled ? 'group-hover:text-[var(--primary)]' : ''} transition-colors w-5 text-center text-sm`}></i>}<span className="truncate">{label}</span></span>
                <div className={`shrink-0 w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-[var(--primary)] shadow-[0_0_10px_rgba(56,189,248,0.3)]' : 'bg-[rgba(255,255,255,0.1)] border border-[var(--glass-border)]'}`}><div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${checked ? '-translate-x-6' : 'translate-x-0'}`}></div></div>
            </label>
        </div>
    );
};

window.SettingListItem = ({ item, path, onDelete, onEditClick, onReorder, isSelected, onClick, isBeingEdited }) => {
    let selectedClasses = isSelected ? 'bg-[rgba(56,189,248,0.15)] border-[var(--primary)] text-[var(--primary)] shadow-[0_4px_12px_rgba(56,189,248,0.1)]' : 'bg-[var(--inner-bg)] border-[var(--glass-border)] hover:bg-[var(--hover-bg)]';
    if (isBeingEdited) selectedClasses = 'bg-[rgba(245,158,11,0.15)] border-[var(--warning)] text-[var(--warning)] shadow-[0_4px_12px_rgba(245,158,11,0.1)]';
    return (
        <div draggable={!isBeingEdited} onDragStart={(e) => { window.globalDraggedSettingId = item.id; e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData('text/plain', item.id); }} onDragEnter={(e) => { e.preventDefault(); if (window.globalDraggedSettingId && window.globalDraggedSettingId !== item.id) { onReorder(path, window.globalDraggedSettingId, item.id); } }} onDragOver={(e) => e.preventDefault()} onDragEnd={() => { window.globalDraggedSettingId = null; }} onClick={onClick} className={`flex items-center p-2.5 border rounded-xl cursor-pointer transition-all duration-300 mb-2 box-border px-3 ${selectedClasses}`}>
            {path === 'platforms' && item.imageUrl && <img src={item.imageUrl} alt={item.label} className="w-6 h-6 rounded-md object-cover ml-2 border border-[var(--glass-border)] shrink-0" />}
            <span className="font-bold flex-1 min-w-0 truncate text-sm" title={item.label}>{item.label}</span>
            <div className="flex items-center gap-2 shrink-0 opacity-70 hover:opacity-100 transition-opacity pr-1">
                <button onClick={(e) => { e.stopPropagation(); onEditClick(item, path); }} className={`p-1 transition-colors text-sm ${isBeingEdited ? 'text-[var(--warning)]' : 'text-[var(--text-muted)] hover:text-[var(--warning)]'}`}><i className="fas fa-edit"></i></button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(path, item.id); }} className="text-[var(--text-muted)] hover:text-[var(--error)] transition-colors p-1 text-sm"><i className="fas fa-trash-alt"></i></button>
            </div>
        </div>
    );
};

window.MainContent = ({ user, auth, database }) => {
    const location = useLocation();
    const activeTab = location.pathname.split('/')[1] || 'requests';

    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(true);
    const [confirmDialog, setConfirmDialog] = React.useState({ isOpen: false, message: '', onConfirm: null });
    const [settingsTab, setSettingsTab] = React.useState('platforms');
    const [accounts, setAccounts] = React.useState([]);
    const [requests, setRequests] = React.useState([]);
    const [emailsData, setEmailsData] = React.useState([]);
    const [isFetchingEmails, setIsFetchingEmails] = React.useState(false);
    const [expandedEmailId, setExpandedEmailId] = React.useState(null);
    const [emailCreds, setEmailCreds] = React.useState([]);
    const [newCredEmail, setNewCredEmail] = React.useState('');
    const [newCredPass, setNewCredPass] = React.useState('');
    const [settings, setSettings] = React.useState({ platforms: [], plans: [], subTypes: [], durations: [], combinationFields: {}, requirementsOrder: [] });
    const [selectedPlatformId, setSelectedPlatformId] = React.useState(null);
    const [selectedPlanId, setSelectedPlanId] = React.useState(null);
    const [selectedTypeId, setSelectedTypeId] = React.useState(null);
    const [selectedDurationId, setSelectedDurationId] = React.useState(null);

    const selectedSettingPlatform = settings.platforms.find(p => p.id === selectedPlatformId)?.label || null;
    const selectedSettingPlan = settings.plans.find(p => p.id === selectedPlanId)?.label || null;
    const selectedSettingType = settings.subTypes.find(s => s.id === selectedTypeId)?.label || null;
    const selectedSettingDuration = settings.durations.find(d => d.id === selectedDurationId)?.label || null;

    const [editTarget, setEditTarget] = React.useState({ path: null, id: null });
    const [newPlatformName, setNewPlatformName] = React.useState('');
    const [newPlatformUrl, setNewPlatformUrl] = React.useState('');
    const [newPlanName, setNewPlanName] = React.useState('');
    const [newTypeName, setNewTypeName] = React.useState('');
    const [newDurLabel, setNewDurLabel] = React.useState('');
    const [newDurVal, setNewDurVal] = React.useState('');
    const [newDurUnit, setNewDurUnit] = React.useState('days');
    const [newWarVal, setNewWarVal] = React.useState('');
    const [newWarUnit, setNewWarUnit] = React.useState('days');
    const [localDeliveryMsg, setLocalDeliveryMsg] = React.useState('');
    const localDeliveryMsgRef = React.useRef(null);
    const [filters, setFilters] = React.useState({
        requests: { platform: 'all', plan: 'all', account: 'all', subType: 'all', status: 'all', search: '' },
        accounts: { platform: 'all', plan: 'all', status: 'all', search: '' }
    });

    const currentFilters = (activeTab === 'settings' || activeTab === 'emails') ? {} : filters[activeTab];
    const setF = (key, val) => setFilters(p => ({ ...p, [activeTab]: { ...p[activeTab], [key]: val } }));
    const clearF = () => setFilters(p => ({ ...p, [activeTab]: { platform: 'all', plan: 'all', account: 'all', subType: 'all', status: 'all', search: '' } }));
    const hasFilters = (activeTab !== 'settings' && activeTab !== 'emails') && Object.values(currentFilters).some(v => v !== 'all' && v !== '');

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [modalType, setModalType] = React.useState('');
    const [reqStep, setReqStep] = React.useState('select'); 
    const [formData, setFormData] = React.useState({});

    const defaultReqsConfig = [
        { id: 'reqAccount', icon: 'fas fa-link', label: 'ربط بحساب' },
        { id: 'reqProfilePos', icon: 'fas fa-sort-numeric-up', label: 'موضع الملف' },
        { id: 'reqPhone', icon: 'fas fa-mobile-alt', label: 'رقم الجوال' }
    ];

    const sortByStartDateDesc = (a, b) => {
        const dateA = new Date(a.startDate || 0).getTime();
        const dateB = new Date(b.startDate || 0).getTime();
        if (dateB !== dateA) return dateB - dateA;
        return a.id > b.id ? -1 : (a.id < b.id ? 1 : 0);
    };

    React.useEffect(() => {
        database.ref('accounts').on('value', (snapshot) => {
            const data = snapshot.val();
            setAccounts(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })).sort(sortByStartDateDesc) : []);
        });
        database.ref('requests').on('value', (snapshot) => {
            const data = snapshot.val();
            setRequests(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })).sort(sortByStartDateDesc) : []);
        });
        database.ref('settings').on('value', snap => {
            const data = snap.val() || {};
            const formatData = (obj) => {
                let arr = obj ? Object.keys(obj).map(id => ({ id, ...obj[id] })) : [];
                arr = arr.map((item, idx) => ({ ...item, order: item.order !== undefined ? item.order : idx }));
                return arr.sort((a, b) => a.order - b.order);
            };
            setSettings({
                platforms: formatData(data.platforms),
                plans: formatData(data.plans),
                subTypes: formatData(data.subscriptionTypes),
                durations: formatData(data.durations),
                combinationFields: data.combinationFields || {},
                requirementsOrder: data.requirementsOrder || []
            });
        });
        database.ref('email_credentials').on('value', (snapshot) => {
            const data = snapshot.val();
            setEmailCreds(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
        });
    }, [database]);

    React.useEffect(() => {
        if (selectedPlatformId && selectedPlanId && selectedTypeId && selectedDurationId) {
            const combId = window.getCombId(selectedPlatformId, selectedPlanId, selectedTypeId, selectedDurationId);
            const msg = settings.combinationFields[combId]?.deliveryMessage || "";
            setLocalDeliveryMsg(msg);
        } else {
            setLocalDeliveryMsg("");
        }
    }, [selectedPlatformId, selectedPlanId, selectedTypeId, selectedDurationId, settings.combinationFields]);

    React.useEffect(() => {
        let emailsRef;
        if (activeTab === 'emails') {
            setIsFetchingEmails(true);
            emailsRef = database.ref('emails');
            emailsRef.on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const parsedEmails = Object.keys(data).map(key => ({ id: key, ...data[key] })).sort((a, b) => new Date(b.date) - new Date(a.date));
                    setEmailsData(parsedEmails);
                } else {
                    setEmailsData([]);
                }
                setIsFetchingEmails(false);
            });
        }
        return () => { if (emailsRef) { emailsRef.off('value'); } };
    }, [activeTab, database]);

    const timeAgoFormatter = (dateStr) => {
        const date = new Date(dateStr); const seconds = Math.floor((new Date() - date) / 1000);
        let interval = Math.floor(seconds / 31536000); if (interval >= 1) return interval === 1 ? "منذ سنة" : interval === 2 ? "منذ سنتين" : "منذ " + interval + " سنوات";
        interval = Math.floor(seconds / 2592000); if (interval >= 1) return interval === 1 ? "منذ شهر" : interval === 2 ? "منذ شهرين" : "منذ " + interval + " أشهر";
        interval = Math.floor(seconds / 86400); if (interval >= 1) return interval === 1 ? "منذ يوم" : interval === 2 ? "منذ يومين" : "منذ " + interval + " أيام";
        interval = Math.floor(seconds / 3600); if (interval >= 1) return interval === 1 ? "منذ ساعة" : interval === 2 ? "منذ ساعتين" : "منذ " + interval + " ساعات";
        interval = Math.floor(seconds / 60); if (interval >= 1) return interval === 1 ? "منذ دقيقة" : interval === 2 ? "منذ دقيقتين" : "منذ " + interval + " دقائق";
        return "الآن";
    };

    React.useEffect(() => {
        if (activeTab === 'requests' && formData.startDate && (formData.durVal !== undefined)) {
            const d = new Date(formData.startDate);
            if (formData.durUnit === 'months') { d.setMonth(d.getMonth() + (parseInt(formData.durVal) || 0)); } else { d.setDate(d.getDate() + (parseInt(formData.durVal) || 0)); }
            const calculatedEndDate = d.toISOString().split('T')[0];
            if (formData.endDate !== calculatedEndDate) { setFormData(prev => ({ ...prev, endDate: calculatedEndDate })); }
        }
    }, [formData.startDate, formData.durVal, formData.durUnit, activeTab]);

    const filterData = (dataArray) => {
        if (!currentFilters) return dataArray;
        let filtered = dataArray;
        if (currentFilters.status !== 'all') { filtered = filtered.filter(item => { const prog = window.calculateProgress(item.startDate, item.endDate); if (currentFilters.status === 'active') return !prog.expired; if (currentFilters.status === 'expired') return prog.expired; return true; }); }
        if (currentFilters.platform !== 'all') { filtered = filtered.filter(item => { const pId = item.platformId || settings.platforms.find(p => p.label === item.platform)?.id; return pId === currentFilters.platform; }); }
        if (currentFilters.plan !== 'all') {
            if (activeTab === 'accounts') { filtered = filtered.filter(item => { const pId = item.planId || settings.plans.find(p => p.label === item.plan && (p.platformId === item.platformId || p.platformName === item.platform))?.id; return pId === currentFilters.plan; }); }
            else if (activeTab === 'requests') { filtered = filtered.filter(item => { let pId = item.planId; if (!pId) { if (item.plan && item.plan !== '-') { pId = settings.plans.find(p => p.label === item.plan && (p.platformId === item.platformId || p.platformName === item.platform))?.id; } else { const reqAccount = accounts.find(a => a.id === item.accountId); pId = reqAccount?.planId || settings.plans.find(p => p.label === reqAccount?.plan && (p.platformId === reqAccount?.platformId || p.platformName === reqAccount?.platform))?.id; } } return pId === currentFilters.plan; }); }
        }
        if (currentFilters.account !== 'all' && currentFilters.account !== undefined && activeTab === 'requests') { filtered = filtered.filter(item => item.accountId === currentFilters.account); }
        if (currentFilters.subType !== 'all' && currentFilters.subType !== undefined && activeTab === 'requests') { filtered = filtered.filter(item => { const sId = item.subscriptionTypeId || settings.subTypes.find(s => s.label === item.subscriptionType && (s.planId === item.planId || s.planName === item.plan))?.id; return sId === currentFilters.subType; }); }
        if (currentFilters.search) { filtered = filtered.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(currentFilters.search.toLowerCase()))); }
        return filtered;
    };

    const handleSave = (e) => {
        e.preventDefault(); const path = activeTab; let finalData = { ...formData };
        const keysToReplace = ['email', 'password', 'phoneNumber', 'profileName', 'profilePin', 'profilePosition', 'accountId'];
        keysToReplace.forEach(key => { if (finalData[key] === '' || finalData[key] === undefined || finalData[key] === null) { finalData[key] = '-'; } });
        if (finalData.amountPaid) { localStorage.setItem('lastAmountPaid', finalData.amountPaid); }
        if (modalType === 'add') { const newRef = database.ref(path).push(); newRef.set({ ...finalData, key: newRef.key }); } else if (modalType === 'edit') { database.ref(`${path}/${finalData.id}`).update(finalData); }
        setIsModalOpen(false); setFormData({});
    };

    const handleDelete = (id) => { setConfirmDialog({ isOpen: true, message: 'تأكيد الحذف نهائياً', onConfirm: () => database.ref(`${activeTab}/${id}`).remove() }); };

    const openModal = (type, data = {}) => {
        setModalType(type); setReqStep(activeTab === 'requests' && type === 'add' ? 'select' : 'fill_data'); let initData = { ...data };
        if (type === 'add') {
            initData.startDate = new Date().toISOString().split('T')[0]; initData.profileName = ''; initData.profilePin = '';
            if (activeTab === 'requests') { initData.phoneNumber = initData.phoneNumber || ""; initData.warrantyVal = initData.warrantyVal !== undefined ? initData.warrantyVal : ""; initData.warrantyUnit = initData.warrantyUnit || "days"; initData.amountPaid = initData.amountPaid !== undefined ? initData.amountPaid : (localStorage.getItem('lastAmountPaid') || ""); }
            if (activeTab === 'accounts') { initData.profiles = []; }
        } else if (type === 'edit') {
            Object.keys(initData).forEach(key => { if (initData[key] === '-') initData[key] = ''; });
            initData.platformId = initData.platformId || settings.platforms.find(p => p.label === initData.platform)?.id || '';
            initData.planId = initData.planId || settings.plans.find(p => p.label === initData.plan && (p.platformId === initData.platformId || p.platformName === initData.platform))?.id || '';
        }
        setFormData(initData); setIsModalOpen(true);
    };

    const handleDuplicate = (item) => { const duplicatedItem = { ...item }; delete duplicatedItem.id; delete duplicatedItem.key; openModal('add', duplicatedItem); if (activeTab === 'requests') { setReqStep('fill_data'); } };

    const handleCopy = (text) => { if(text && text !== '-') navigator.clipboard.writeText(text); };
    const handleWhatsApp = (phone) => { if(phone && phone !== '-') window.open(`https://api.whatsapp.com/send?phone=${phone.replace(/\D/g, '')}`, '_blank'); };

    const handleCancelEdit = () => {
        setEditTarget({path: null, id: null}); setNewPlatformName(''); setNewPlatformUrl(''); setNewPlanName(''); setNewTypeName('');
        setNewDurLabel(''); setNewDurVal(''); setNewDurUnit('days'); setNewWarVal(''); setNewWarUnit('days');
    };

    const handleEditClick = (item, path) => {
        setEditTarget({ path, id: item.id });
        if (path === 'platforms') { setNewPlatformName(item.label); setNewPlatformUrl(item.imageUrl || ''); } else if (path === 'plans') { setNewPlanName(item.label); } else if (path === 'subscriptionTypes') { setNewTypeName(item.label); } else if (path === 'durations') { setNewDurLabel(item.label); setNewDurVal(item.durVal || item.durMonths || item.durDays || ''); setNewDurUnit(item.durUnit || (item.durMonths ? 'months' : 'days')); setNewWarVal(item.warrantyVal || ''); setNewWarUnit(item.warrantyUnit || 'days'); }
    };

    const handleAddOrEditSetting = async (e, path, extraData = {}) => {
        e.preventDefault(); let newValue = '';
        if (path === 'platforms') { if (!newPlatformName.trim()) return; newValue = newPlatformName.trim(); extraData.imageUrl = newPlatformUrl.trim(); } else if (path === 'plans') { if (!newPlanName.trim()) return; newValue = newPlanName.trim(); } else if (path === 'subscriptionTypes') { if(!newTypeName.trim()) return; newValue = newTypeName.trim(); }
        if (editTarget.id && editTarget.path === path) {
            let itemsList = []; if (path === 'platforms') itemsList = settings.platforms; if (path === 'plans') itemsList = settings.plans; if (path === 'subscriptionTypes') itemsList = settings.subTypes;
            const item = itemsList.find(i => i.id === editTarget.id); if (item) { await processEditSetting(path, item, newValue, extraData); }
            handleCancelEdit();
        } else {
            database.ref(`settings/${path}`).push({ label: newValue, value: newValue, order: Date.now(), ...extraData });
            if (path === 'platforms') { setNewPlatformName(''); setNewPlatformUrl(''); } if (path === 'plans') { setNewPlanName(''); } if (path === 'subscriptionTypes') { setNewTypeName(''); }
        }
    };

    const handleAddOrEditDuration = async (e) => {
        e.preventDefault(); if (!newDurLabel.trim() || !selectedSettingType) return;
        const durData = { durVal: parseInt(newDurVal) || 0, durUnit: newDurUnit, warrantyVal: parseInt(newWarVal) || 0, warrantyUnit: newWarUnit };
        if (editTarget.id && editTarget.path === 'durations') {
            const item = settings.durations.find(i => i.id === editTarget.id); if (item) { await processEditSetting('durations', item, newDurLabel.trim(), durData); }
            handleCancelEdit();
        } else {
            database.ref(`settings/durations`).push({ label: newDurLabel.trim(), value: newDurLabel.trim(), ...durData, typeName: selectedSettingType, typeId: selectedTypeId, planName: selectedSettingPlan, planId: selectedPlanId, platformName: selectedSettingPlatform, platformId: selectedPlatformId, order: Date.now() });
            handleCancelEdit(); 
        }
    };

    const handleDeleteSetting = (path, id) => {
        setConfirmDialog({
            isOpen: true, message: 'تأكيد الحذف (سيتم حذف أي بيانات فرعية ورسائل التسليم المرتبطة بها نهائياً)',
            onConfirm: () => {
                const updates = {}; updates[`settings/${path}/${id}`] = null;
                if (path === 'platforms') { settings.plans.filter(p => p.platformId === id).forEach(p => updates[`settings/plans/${p.id}`] = null); settings.subTypes.filter(s => s.platformId === id).forEach(s => updates[`settings/subscriptionTypes/${s.id}`] = null); settings.durations.filter(d => d.platformId === id).forEach(d => updates[`settings/durations/${d.id}`] = null); if(selectedPlatformId === id) { setSelectedPlatformId(null); setSelectedPlanId(null); setSelectedTypeId(null); setSelectedDurationId(null); } } else if (path === 'plans') { settings.subTypes.filter(s => s.planId === id).forEach(s => updates[`settings/subscriptionTypes/${s.id}`] = null); settings.durations.filter(d => d.planId === id).forEach(d => updates[`settings/durations/${d.id}`] = null); if(selectedPlanId === id) { setSelectedPlanId(null); setSelectedTypeId(null); setSelectedDurationId(null); } } else if (path === 'subscriptionTypes') { settings.durations.filter(d => d.typeId === id).forEach(d => updates[`settings/durations/${d.id}`] = null); if(selectedTypeId === id) { setSelectedTypeId(null); setSelectedDurationId(null); } } else if (path === 'durations') { if(selectedDurationId === id) setSelectedDurationId(null); }
                Object.keys(settings.combinationFields || {}).forEach(combId => { if (combId.includes(id)) updates[`settings/combinationFields/${combId}`] = null; });
                database.ref().update(updates); if (editTarget.id === id) handleCancelEdit();
            }
        });
    };

    const processEditSetting = async (path, item, newValue, extraData = {}) => {
        const updates = {}; updates[`settings/${path}/${item.id}/label`] = newValue; updates[`settings/${path}/${item.id}/value`] = newValue;
        if (extraData && extraData.imageUrl !== undefined) updates[`settings/${path}/${item.id}/imageUrl`] = extraData.imageUrl; if (extraData && extraData.durVal !== undefined) updates[`settings/${path}/${item.id}/durVal`] = extraData.durVal; if (extraData && extraData.durUnit !== undefined) updates[`settings/${path}/${item.id}/durUnit`] = extraData.durUnit; if (extraData && extraData.warrantyVal !== undefined) updates[`settings/${path}/${item.id}/warrantyVal`] = extraData.warrantyVal; if (extraData && extraData.warrantyUnit !== undefined) updates[`settings/${path}/${item.id}/warrantyUnit`] = extraData.warrantyUnit;
        const oldLabel = item.label;
        if (path === 'platforms') { settings.plans.forEach(plan => { if (plan.platformId === item.id) updates[`settings/plans/${plan.id}/platformName`] = newValue; }); settings.subTypes.forEach(sub => { if (sub.platformId === item.id) updates[`settings/subscriptionTypes/${sub.id}/platformName`] = newValue; }); settings.durations.forEach(dur => { if (dur.platformId === item.id) updates[`settings/durations/${dur.id}/platformName`] = newValue; }); accounts.forEach(acc => { if (acc.platform === oldLabel) updates[`accounts/${acc.id}/platform`] = newValue; }); requests.forEach(req => { if (req.platform === oldLabel) updates[`requests/${req.id}/platform`] = newValue; }); } else if (path === 'plans') { settings.subTypes.forEach(sub => { if (sub.planId === item.id) updates[`settings/subscriptionTypes/${sub.id}/planName`] = newValue; }); settings.durations.forEach(dur => { if (dur.planId === item.id) updates[`settings/durations/${dur.id}/planName`] = newValue; }); accounts.forEach(acc => { if (acc.plan === oldLabel && acc.platform === selectedSettingPlatform) updates[`accounts/${acc.id}/plan`] = newValue; }); requests.forEach(req => { if (req.plan === oldLabel && req.platform === selectedSettingPlatform) updates[`requests/${req.id}/plan`] = newValue; }); } else if (path === 'subscriptionTypes') { settings.durations.forEach(dur => { if (dur.typeId === item.id) updates[`settings/durations/${dur.id}/typeName`] = newValue; }); requests.forEach(req => { if (req.subscriptionType === oldLabel && req.plan === selectedSettingPlan && req.platform === selectedSettingPlatform) updates[`requests/${req.id}/subscriptionType`] = newValue; }); } else if (path === 'durations') { requests.forEach(req => { if (req.durationLabel === oldLabel && req.subscriptionType === selectedSettingType && req.plan === selectedSettingPlan && req.platform === selectedSettingPlatform) { updates[`requests/${req.id}/durationLabel`] = newValue; } }); }
        try { await database.ref().update(updates); } catch (error) { console.error(error); }
    };

    const handleReorderSetting = (path, draggedId, targetId) => {
        if (draggedId === targetId) return;
        let currentList = [];
        if (path === 'platforms') currentList = [...settings.platforms]; else if (path === 'plans') currentList = settings.plans.filter(p => p.platformId ? p.platformId === selectedPlatformId : p.platformName === selectedSettingPlatform); else if (path === 'subscriptionTypes') currentList = settings.subTypes.filter(s => s.planId ? s.planId === selectedPlanId : (s.planName === selectedSettingPlan && s.platformName === selectedSettingPlatform)); else if (path === 'durations') currentList = settings.durations.filter(d => d.typeId ? d.typeId === selectedTypeId : (d.typeName === selectedSettingType && d.planName === selectedSettingPlan && d.platformName === selectedSettingPlatform));
        const draggedIndex = currentList.findIndex(x => x.id === draggedId); const targetIndex = currentList.findIndex(x => x.id === targetId); if (draggedIndex === -1 || targetIndex === -1) return;
        const newList = [...currentList]; const [removed] = newList.splice(draggedIndex, 1); newList.splice(targetIndex, 0, removed);
        const updates = {}; newList.forEach((item, index) => { updates[`settings/${path}/${item.id}/order`] = index; });
        database.ref().update(updates).catch(err => console.error(err));
    };

    const getAllCombinations = () => {
        const combinations = [];
        settings.platforms.forEach(platform => {
            const platformPlans = settings.plans.filter(p => p.platformId ? p.platformId === platform.id : p.platformName === platform.label);
            if (platformPlans.length === 0) { combinations.push({ platform: platform.label, platformId: platform.id, plan: '—', type: '—', duration: '—', pImg: platform.imageUrl }); } else {
                platformPlans.forEach(plan => {
                    const planTypes = settings.subTypes.filter(s => s.planId ? s.planId === plan.id : (s.planName === plan.label && s.platformName === platform.label));
                    if (planTypes.length === 0) { combinations.push({ platform: platform.label, platformId: platform.id, plan: plan.label, planId: plan.id, type: '—', duration: '—', pImg: platform.imageUrl }); } else {
                        planTypes.forEach(type => {
                            const typeDurations = settings.durations.filter(d => d.typeId ? d.typeId === type.id : (d.typeName === type.label && d.planName === plan.label && d.platformName === platform.label));
                            if (typeDurations.length === 0) { combinations.push({ platform: platform.label, platformId: platform.id, plan: plan.label, planId: plan.id, type: type.label, typeId: type.id, duration: '—', pImg: platform.imageUrl }); } else {
                                typeDurations.forEach(dur => { combinations.push({ platform: platform.label, platformId: platform.id, plan: plan.label, planId: plan.id, type: type.label, typeId: type.id, duration: dur.label, durationId: dur.id, durVal: dur.durVal || dur.durMonths || dur.durDays || 0, durUnit: dur.durUnit || (dur.durMonths ? 'months' : 'days'), warrantyVal: dur.warrantyVal || 0, warrantyUnit: dur.warrantyUnit || 'days', pImg: platform.imageUrl }); });
                            }
                        });
                    }
                });
            }
        });
        return combinations;
    };

    const selectCombination = (comb) => {
        setFormData(prev => ({ ...prev, platform: comb.platform, platformId: comb.platformId, plan: comb.plan === '—' ? '' : comb.plan, planId: comb.planId, subscriptionType: comb.type === '—' ? '' : comb.type, subscriptionTypeId: comb.typeId, durationLabel: comb.duration === '—' ? '' : comb.duration, durationId: comb.durationId, durVal: comb.durVal || 0, durUnit: comb.durUnit || 'days', warrantyVal: comb.warrantyVal || 0, warrantyUnit: comb.warrantyUnit || 'days', accountId: '', profilePosition: '' }));
        setReqStep('fill_data');
    };

    const handleToggleRequirement = (field, value) => {
        if (!selectedPlatformId || !selectedPlanId || !selectedTypeId || !selectedDurationId) return;
        const combId = window.getCombId(selectedPlatformId, selectedPlanId, selectedTypeId, selectedDurationId);
        const currentConfig = settings.combinationFields[combId] || { reqAccount: true, reqProfilePos: true, reqPhone: true, deliveryMessage: "" };
        database.ref(`settings/combinationFields/${combId}`).set({ ...currentConfig, [field]: value });
    };

    let displayReqs = [...defaultReqsConfig];
    if (settings.requirementsOrder && settings.requirementsOrder.length > 0) { displayReqs.sort((a, b) => { let indexA = settings.requirementsOrder.indexOf(a.id); let indexB = settings.requirementsOrder.indexOf(b.id); if (indexA === -1) indexA = 999; if (indexB === -1) indexB = 999; return indexA - indexB; }); }

    const handleReorderRequirement = (draggedId, targetId) => {
        if (draggedId === targetId) return; const newOrderArray = [...displayReqs.map(r => r.id)]; const draggedIndex = newOrderArray.indexOf(draggedId); const targetIndex = newOrderArray.indexOf(targetId); if (draggedIndex === -1 || targetIndex === -1) return; const [removed] = newOrderArray.splice(draggedIndex, 1); newOrderArray.splice(targetIndex, 0, removed); database.ref('settings/requirementsOrder').set(newOrderArray);
    };

    const updateLocalMessage = (textToSave) => {
        if (!selectedPlatformId || !selectedPlanId || !selectedTypeId || !selectedDurationId) return; const combId = window.getCombId(selectedPlatformId, selectedPlanId, selectedTypeId, selectedDurationId); database.ref(`settings/combinationFields/${combId}/deliveryMessage`).set(textToSave);
    };

    const insertVarToLocalMessage = (varText) => {
        const startPos = localDeliveryMsgRef.current.selectionStart; const endPos = localDeliveryMsgRef.current.selectionEnd; const newText = localDeliveryMsg.substring(0, startPos) + varText + localDeliveryMsg.substring(endPos, localDeliveryMsg.length); setLocalDeliveryMsg(newText); updateLocalMessage(newText); setTimeout(() => { localDeliveryMsgRef.current.focus(); localDeliveryMsgRef.current.selectionStart = startPos + varText.length; localDeliveryMsgRef.current.selectionEnd = startPos + varText.length; }, 0);
    };

    const generateAndShareSummary = async (item) => {
        let combId1 = window.getCombId(item.platformId, item.planId, item.subscriptionTypeId, item.durationId); let msg = settings.combinationFields[combId1]?.deliveryMessage;
        if (!msg) { const pObj = settings.platforms.find(p => p.label === item.platform); const plObj = settings.plans.find(p => (p.platformId === pObj?.id || p.platformName === item.platform) && p.label === item.plan); const tObj = settings.subTypes.find(s => (s.planId === plObj?.id || s.planName === item.plan) && s.label === item.subscriptionType); const dObj = settings.durations.find(d => (d.typeId === tObj?.id || d.typeName === item.subscriptionType) && d.label === item.durationLabel); const combId2 = window.getCombId(pObj?.id, plObj?.id, tObj?.id, dObj?.id); msg = settings.combinationFields[combId2]?.deliveryMessage; }
        msg = msg || ''; const reqAccount = item.accountId && item.accountId !== '-' ? accounts.find(a => a.id === item.accountId) || {} : {}; const startD = new Date(item.startDate); let warEndD = new Date(startD.getTime()); if (item.warrantyUnit === 'months') { warEndD.setMonth(warEndD.getMonth() + parseInt(item.warrantyVal || 0)); } else { warEndD.setDate(warEndD.getDate() + parseInt(item.warrantyVal || 0)); } const warEndStr = warEndD.toISOString().split('T')[0];
        msg = msg.replace(/\[المنصة\]/g, item.platform || ''); msg = msg.replace(/\[الخطة\]/g, item.plan && item.plan !== '-' ? item.plan : ''); msg = msg.replace(/\[النوع\]/g, item.subscriptionType && item.subscriptionType !== '-' ? item.subscriptionType : ''); msg = msg.replace(/\[المدة\]/g, item.durationLabel || ''); msg = msg.replace(/\[اسم_المستخدم\]/g, reqAccount.email || ''); msg = msg.replace(/\[كلمة_المرور\]/g, reqAccount.password || ''); msg = msg.replace(/\[اسم_الملف\]/g, item.profileName && item.profileName !== '-' ? item.profileName : ''); msg = msg.replace(/\[رمز_الملف\]/g, item.profilePin && item.profilePin !== '-' ? item.profilePin : ''); msg = msg.replace(/\[تاريخ_البدء\]/g, item.startDate || ''); msg = msg.replace(/\[تاريخ_الانتهاء\]/g, item.endDate || ''); msg = msg.replace(/\[تاريخ_انتهاء_الضمان\]/g, warEndStr || '');
        let phone = item.phoneNumber || ''; phone = phone.replace(/\D/g, ''); const waUrl = phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
        try { await navigator.clipboard.writeText(msg); } catch (err) {}
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); if (isMobile) { window.location.href = waUrl; } else { const win = window.open(waUrl, '_blank'); if (!win) window.location.href = waUrl; }
    };

    let fPlatformId = settings.platforms.find(p => p.label === formData.platform)?.id; let fPlanId = settings.plans.find(p => p.label === formData.plan && (p.platformId === fPlatformId || p.platformName === formData.platform))?.id; let fTypeId = settings.subTypes.find(s => s.label === formData.subscriptionType && (s.planId === fPlanId || s.planName === formData.plan))?.id; let fDurId = settings.durations.find(d => d.label === formData.durationLabel && (d.typeId === fTypeId || d.typeName === formData.subscriptionType))?.id;
    const combIdForm = window.getCombId(fPlatformId, fPlanId, fTypeId, fDurId); const reqConfigForm = settings.combinationFields[combIdForm] || { reqAccount: true, reqProfilePos: true, reqPhone: true };
    const isCombSelected = selectedPlatformId && selectedPlanId && selectedTypeId && selectedDurationId; let currentReqConfig = { reqAccount: true, reqProfilePos: true, reqPhone: true };
    if (isCombSelected) { const currentCombId = window.getCombId(selectedPlatformId, selectedPlanId, selectedTypeId, selectedDurationId); currentReqConfig = settings.combinationFields[currentCombId] || currentReqConfig; }

    const moveProfile = (index, dir) => { const newProfiles = [...(formData.profiles || [])]; if (index + dir >= 0 && index + dir < newProfiles.length) { const temp = newProfiles[index]; newProfiles[index] = newProfiles[index + dir]; newProfiles[index + dir] = temp; setFormData({...formData, profiles: newProfiles}); } };

    return (
        <div className="flex h-screen relative w-full max-w-[1600px] mx-auto z-10">
            <aside className={`admin-panel m-4 rounded-3xl flex flex-col z-20 shrink-0 shadow-2xl transition-all duration-300 w-24`}>
                <div className="p-6 text-center border-b border-[var(--glass-border)] flex justify-center items-center h-28 relative">
                    <div className="w-12 h-12 rounded-2xl bg-[rgba(56,189,248,0.15)] border border-[rgba(56,189,248,0.3)] flex justify-center items-center cursor-pointer hover:bg-[var(--primary)] group transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:scale-105 mx-auto" onClick={() => window.location.reload()}>
                        <i className="fas fa-store text-xl text-[var(--primary)] group-hover:text-white transition-colors"></i>
                    </div>
                </div>
                <nav className="flex-1 flex flex-col p-4 gap-3 mt-2 overflow-y-auto">
                    <Link to="/requests" title="الطلبات" className={`w-full p-4 rounded-2xl transition-all duration-300 flex items-center justify-center text-sm font-bold ${activeTab === 'requests' ? 'bg-gradient-to-l from-[var(--primary)] to-[var(--primary-hover)] text-white shadow-[0_4px_15px_rgba(56,189,248,0.4)]' : 'hover:bg-[var(--hover-bg)] text-[var(--text-main)]'}`}><i className="fas fa-shopping-cart text-xl"></i></Link>
                    <Link to="/accounts" title="الحسابات" className={`w-full p-4 rounded-2xl transition-all duration-300 flex items-center justify-center text-sm font-bold ${activeTab === 'accounts' ? 'bg-gradient-to-l from-[var(--primary)] to-[var(--primary-hover)] text-white shadow-[0_4px_15px_rgba(56,189,248,0.4)]' : 'hover:bg-[var(--hover-bg)] text-[var(--text-main)]'}`}><i className="fas fa-desktop text-xl"></i></Link>
                    <Link to="/emails" title="بريد الحسابات" className={`w-full p-4 rounded-2xl transition-all duration-300 flex items-center justify-center text-sm font-bold ${activeTab === 'emails' ? 'bg-gradient-to-l from-[var(--primary)] to-[var(--primary-hover)] text-white shadow-[0_4px_15px_rgba(56,189,248,0.4)]' : 'hover:bg-[var(--hover-bg)] text-[var(--text-main)]'}`}><i className="fas fa-envelope-open-text text-xl"></i></Link>
                    <Link to="/settings" title="إعدادات" className={`w-full p-4 rounded-2xl transition-all duration-300 flex items-center justify-center text-sm font-bold ${activeTab === 'settings' ? 'bg-gradient-to-l from-[var(--primary)] to-[var(--primary-hover)] text-white shadow-[0_4px_15px_rgba(56,189,248,0.4)]' : 'hover:bg-[var(--hover-bg)] text-[var(--text-main)]'}`}><i className="fas fa-cog text-xl"></i></Link>
                    <button onClick={() => auth.signOut()} title="خروج" className="mt-auto w-full p-4 rounded-2xl transition-all duration-300 flex items-center justify-center text-sm font-bold text-[var(--error)] border border-transparent hover:border-[rgba(239,68,68,0.3)] hover:bg-[rgba(239,68,68,0.1)]"><i className="fas fa-sign-out-alt text-xl"></i></button>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col h-screen overflow-hidden py-4 pr-0 pl-4 z-10 transition-all duration-300">
                <div className="flex-1 overflow-y-auto relative rounded-3xl pb-4">
                    { (activeTab === 'requests' || activeTab === 'accounts') && (
                        <div className="flex flex-col h-full relative">
                            <div className="admin-panel p-4 rounded-3xl mb-6 flex flex-wrap justify-between items-center gap-4 shrink-0 z-20 shadow-lg">
                                <h3 className="font-bold text-[var(--text-main)] text-lg flex items-center gap-2">
                                    <span className="bg-[rgba(56,189,248,0.15)] text-[var(--primary)] px-2 py-0.5 rounded-lg text-sm border border-[rgba(56,189,248,0.3)]">
                                        {filterData(activeTab === 'accounts' ? accounts : requests).length}
                                    </span>
                                </h3>
                                <div className="flex flex-wrap gap-3 flex-1 justify-end items-center">
                                    {hasFilters && (
                                        <button onClick={clearF} className="h-[42px] px-4 mr-auto bg-[rgba(239,68,68,0.1)] hover:bg-[var(--error)] text-[var(--error)] hover:text-white rounded-xl transition-all text-sm font-bold flex items-center justify-center gap-2 border border-[rgba(239,68,68,0.3)] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"><i className="fas fa-times"></i> مسح التصفية</button>
                                    )}
                                    <div className="w-32 relative text-sm h-[42px] z-[100]">
                                        <window.CustomSelect customClass="px-3 h-full" options={[{ label: 'الكل', value: 'all' }, ...settings.platforms.map(p => ({ label: p.label, value: p.id }))]} value={currentFilters?.platform || 'all'} onChange={(val) => {setF('platform', val); setF('plan', 'all'); setF('subType', 'all'); setF('account', 'all');}} />
                                    </div>
                                    <div className="w-32 relative text-sm h-[42px] z-[99]">
                                        <window.CustomSelect customClass="px-3 h-full" disabled={currentFilters?.platform === 'all'} options={[{ label: 'الكل', value: 'all' }, ...settings.plans.filter(p => currentFilters?.platform === 'all' || p.platformId === currentFilters?.platform).map(p => ({ label: p.label, value: p.id }))]} value={currentFilters?.plan || 'all'} onChange={(val) => {setF('plan', val); setF('subType', 'all'); setF('account', 'all');}} />
                                    </div>
                                    {activeTab === 'requests' && (
                                        <div className="w-32 relative text-sm h-[42px] z-[98]">
                                            <window.CustomSelect customClass="px-3 h-full" disabled={currentFilters?.platform === 'all' || currentFilters?.plan === 'all'} options={[{ label: 'الكل', value: 'all' }, ...accounts.filter(a => a.platformId === currentFilters?.platform && a.planId === currentFilters?.plan).map(a => ({ label: a.email || a.id, value: a.id }))]} value={currentFilters?.account || 'all'} onChange={(val) => setF('account', val)} />
                                        </div>
                                    )}
                                    {activeTab === 'requests' && (
                                        <div className="w-32 relative text-sm h-[42px] z-[97]">
                                            <window.CustomSelect customClass="px-3 h-full" disabled={currentFilters?.platform === 'all'} options={[{ label: 'الكل', value: 'all' }, ...settings.subTypes.filter(s => { if (currentFilters?.plan !== 'all') return s.planId === currentFilters?.plan; if (currentFilters?.platform !== 'all') return s.platformId === currentFilters?.platform; return true; }).map(s => ({ label: s.label, value: s.id }))]} value={currentFilters?.subType || 'all'} onChange={(val) => setF('subType', val)} />
                                        </div>
                                    )}
                                    <div className="w-32 relative text-sm hidden sm:block h-[42px] z-[96]">
                                        <window.CustomSelect customClass="px-3 h-full" options={[{ label: 'الكل', value: 'all' }, { label: 'سارية', value: 'active' }, { label: 'منتهية', value: 'expired' }]} value={currentFilters?.status || 'all'} onChange={(val) => setF('status', val)} />
                                    </div>
                                    <div className="relative w-48 flex items-center text-[var(--text-muted)] focus-within:text-[var(--primary)] transition-colors h-[42px]">
                                        <i className="fas fa-search absolute right-3 pointer-events-none text-sm"></i>
                                        <input type="text" value={currentFilters?.search || ''} onChange={(e) => { let val = e.target.value; if (activeTab === 'requests') { val = val.replace(/[^\d+]/g, ''); } setF('search', val); }} className="w-full h-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-main)] focus:border-[var(--primary)] rounded-xl py-2 pr-9 pl-3 outline-none transition-all duration-300 text-sm focus:shadow-[0_0_12px_rgba(56,189,248,0.2)]" />
                                    </div>
                                    <button onClick={() => openModal('add')} className="h-[42px] bg-gradient-to-l from-[var(--primary)] to-[var(--primary-hover)] text-white px-5 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2 shrink-0"><i className="fas fa-plus text-sm"></i></button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto pb-10">
                                {filterData(activeTab === 'accounts' ? accounts : requests).length === 0 ? (
                                    <div className="text-center p-16 text-[var(--text-muted)] flex flex-col items-center justify-center h-full">
                                        <div className="w-20 h-20 bg-[var(--inner-bg)] border border-[var(--glass-border)] rounded-full flex items-center justify-center mb-4"><i className="fas fa-inbox text-4xl opacity-50"></i></div>
                                        <span className="font-bold">لا توجد بيانات مطابقة</span>
                                    </div>
                                ) : (
                                    <Switch>
                                        <Route path="/accounts">
                                            <window.Accounts filterData={filterData} accounts={accounts} settings={settings} calculateProgress={window.calculateProgress} formatRemainingTime={window.formatRemainingTime} handleCopy={handleCopy} handleDuplicate={handleDuplicate} openModal={openModal} handleDelete={handleDelete} />
                                        </Route>
                                        <Route path="/requests">
                                            <window.Requests filterData={filterData} requests={requests} accounts={accounts} settings={settings} calculateProgress={window.calculateProgress} formatRemainingTime={window.formatRemainingTime} handleWhatsApp={handleWhatsApp} handleCopy={handleCopy} generateAndShareSummary={generateAndShareSummary} handleDuplicate={handleDuplicate} openModal={openModal} handleDelete={handleDelete} />
                                        </Route>
                                    </Switch>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <window.Settings 
                            settingsTab={settingsTab} setSettingsTab={setSettingsTab} settings={settings} selectedPlatformId={selectedPlatformId} setSelectedPlatformId={setSelectedPlatformId} selectedPlanId={selectedPlanId} setSelectedPlanId={setSelectedPlanId} selectedTypeId={selectedTypeId} setSelectedTypeId={setSelectedTypeId} selectedDurationId={selectedDurationId} setSelectedDurationId={setSelectedDurationId} editTarget={editTarget} handleAddOrEditSetting={handleAddOrEditSetting} newPlatformName={newPlatformName} setNewPlatformName={setNewPlatformName} newPlatformUrl={newPlatformUrl} setNewPlatformUrl={setNewPlatformUrl} handleCancelEdit={handleCancelEdit} handleDeleteSetting={handleDeleteSetting} handleEditClick={handleEditClick} handleReorderSetting={handleReorderSetting} selectedSettingPlatform={selectedSettingPlatform} newPlanName={newPlanName} setNewPlanName={setNewPlanName} selectedSettingPlan={selectedSettingPlan} newTypeName={newTypeName} setNewTypeName={setNewTypeName} handleAddOrEditDuration={handleAddOrEditDuration} newDurLabel={newDurLabel} setNewDurLabel={setNewDurLabel} newDurVal={newDurVal} setNewDurVal={setNewDurVal} newDurUnit={newDurUnit} setNewDurUnit={setNewDurUnit} newWarVal={newWarVal} setNewWarVal={setNewWarVal} newWarUnit={newWarUnit} setNewWarUnit={setNewWarUnit} selectedSettingType={selectedSettingType} isCombSelected={isCombSelected} displayReqs={displayReqs} currentReqConfig={currentReqConfig} handleToggleRequirement={handleToggleRequirement} handleReorderRequirement={handleReorderRequirement} localDeliveryMsg={localDeliveryMsg} setLocalDeliveryMsg={setLocalDeliveryMsg} updateLocalMessage={updateLocalMessage} insertVarToLocalMessage={insertVarToLocalMessage} localDeliveryMsgRef={localDeliveryMsgRef} newCredEmail={newCredEmail} setNewCredEmail={setNewCredEmail} newCredPass={newCredPass} setNewCredPass={setNewCredPass} emailCreds={emailCreds} setConfirmDialog={setConfirmDialog} database={database}
                        />
                    )}

                    {activeTab === 'emails' && (
                        <window.Emails emailsData={emailsData} isFetchingEmails={isFetchingEmails} expandedEmailId={expandedEmailId} setExpandedEmailId={setExpandedEmailId} setConfirmDialog={setConfirmDialog} database={database} timeAgoFormatter={timeAgoFormatter} />
                    )}

                    <Switch>
                        <Route exact path="/"><Redirect to="/requests" /></Route>
                    </Switch>
                </div>
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
                    <div className="admin-panel rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl border border-[var(--glass-border)]" style={{ backgroundColor: 'var(--bg-main)' }}>
                        <div className="p-5 border-b border-[var(--glass-border)] flex justify-between items-center bg-[rgba(0,0,0,0.4)]">
                            <div className="flex items-center gap-3">
                                {activeTab === 'requests' && modalType === 'add' && reqStep === 'fill_data' && (
                                    <button type="button" onClick={() => setReqStep('select')} className="w-8 h-8 rounded-full bg-[var(--inner-bg)] hover:bg-[var(--hover-bg)] flex items-center justify-center text-[var(--text-main)] transition-all border border-[var(--glass-border)] text-sm"><i className="fas fa-arrow-right text-sm"></i></button>
                                )}
                                <h3 className="font-bold text-xl text-[var(--text-main)] gradient-text">{modalType === 'add' ? (reqStep === 'select' ? 'اختر' : 'إضافة') : 'تعديل'}</h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-[var(--input-bg)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[rgba(239,68,68,0.1)] transition-all text-sm"><i className="fas fa-times text-sm"></i></button>
                        </div>
                        {activeTab === 'requests' && modalType === 'add' && reqStep === 'select' ? (
                            <div className="p-6 overflow-y-auto flex-1 bg-transparent">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {getAllCombinations().map((comb, index) => (
                                        <div key={index} onClick={() => selectCombination(comb)} className="cursor-pointer bg-[var(--inner-bg)] border border-[var(--glass-border)] hover:border-[var(--primary)] hover:bg-[var(--hover-bg)] p-4 rounded-2xl transition-all shadow-sm hover:shadow-[0_0_15px_rgba(56,189,248,0.2)] flex flex-col gap-3 group">
                                            <div className="flex items-center gap-2 flex-wrap mt-1">
                                                {comb.pImg ? <img src={comb.pImg} className="w-6 h-6 rounded-md object-cover border border-[var(--glass-border)]" /> : <i className="fas fa-tv text-[var(--primary)] text-base"></i>}
                                                <span className="font-bold text-[var(--text-main)] text-[15px]">{comb.platform}</span>
                                                {comb.plan && comb.plan !== '—' && <span className="bg-[rgba(56,189,248,0.15)] text-[var(--primary)] px-2 py-0.5 rounded text-[11px] font-bold">{comb.plan}</span>}
                                                {comb.type && comb.type !== '—' && <span className="bg-[rgba(245,158,11,0.15)] text-[var(--warning)] px-2 py-0.5 rounded text-[11px] font-bold">{comb.type}</span>}
                                                {comb.duration && comb.duration !== '—' && <span className="bg-[rgba(16,185,129,0.15)] text-[var(--success)] px-2 py-0.5 rounded text-[11px] font-bold">{comb.duration}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 bg-transparent">
                                {activeTab === 'accounts' ? (
                                    <>
                                        <div className="col-span-1 relative z-[80]">
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">المنصة</label>
                                            <div className="h-[46px]"><window.CustomSelect options={settings.platforms.map(p => ({ label: p.label, value: p.id }))} value={formData.platformId || ''} onChange={(val) => { const p = settings.platforms.find(x => x.id === val); setFormData({...formData, platform: p.label, platformId: p.id, plan: '', planId: '', subscriptionType: '', accountId: '', profilePosition: ''}); }} required={true} customClass="px-3 h-full text-sm font-bold" /></div>
                                        </div>
                                        <div className="col-span-1 relative z-[80]">
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">الخطة</label>
                                            <div className="h-[46px]"><window.CustomSelect options={settings.plans.filter(p => p.platformId === formData.platformId).map(p => ({ label: p.label, value: p.id }))} value={formData.planId || ''} onChange={(val) => { const p = settings.plans.find(x => x.id === val); setFormData({...formData, plan: p.label, planId: p.id}); }} required={true} customClass="px-3 h-full text-sm font-bold" /></div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="col-span-1 md:col-span-2 mb-4 hidden p-4 bg-gradient-to-l from-[var(--input-bg)] to-[rgba(56,189,248,0.05)] border border-[rgba(56,189,248,0.1)] rounded-2xl flex-wrap justify-center gap-5 text-sm font-bold items-center shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                                            <span className="text-[var(--text-main)] flex items-center gap-2 text-sm"><i className="fas fa-layer-group text-[var(--primary)] text-lg"></i> {formData.plan || '-'}</span>
                                            <i className="fas fa-chevron-left text-[var(--text-muted)] text-sm opacity-50"></i>
                                            <span className="text-[var(--warning)] flex items-center gap-2 drop-shadow-[0_0_5px_rgba(245,158,11,0.3)] text-sm"><i className="fas fa-tag text-sm"></i> {formData.subscriptionType || '-'}</span>
                                            {formData.durationLabel && formData.durationLabel !== '—' && (
                                                <><i className="fas fa-chevron-left text-[var(--text-muted)] text-sm opacity-50"></i><span className="text-[var(--success)] flex items-center gap-2 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)] text-sm"><i className="fas fa-calendar-alt text-sm"></i> {formData.durationLabel}</span></>
                                            )}
                                        </div>
                                        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {displayReqs.map(req => {
                                            if (!reqConfigForm[req.id]) return null;
                                            switch(req.id) {
                                                case 'reqAccount':
                                                    return (
                                                        <div key={req.id} className="col-span-1 sm:col-span-2 lg:col-span-1 relative z-[79]">
                                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">الحساب</label>
                                                            <div className="h-[46px]">
                                                            {(() => {
                                                                const availableAccounts = accounts.filter(a => a.platformId === formData.platformId && a.planId === formData.planId);
                                                                const accountOptions = availableAccounts.map(a => ({ label: `${a.email || ''}`, value: a.id }));
                                                                return (<window.CustomSelect options={accountOptions} value={formData.accountId} onChange={(val) => setFormData({...formData, accountId: val, profilePosition: '', profileName: '', profilePin: ''})} required={true} customClass="px-3 h-full text-sm font-bold" />);
                                                            })()}
                                                            </div>
                                                        </div>
                                                    );
                                                case 'reqProfilePos':
                                                    return (
                                                        <div key={req.id} className="col-span-1 relative z-[77]">
                                                            <label className="block text-sm font-bold text-[var(--primary)] mb-2">الملف</label>
                                                            <div className="h-[46px]">
                                                            {(() => {
                                                                let profileOptions = [];
                                                                if (formData.accountId) {
                                                                    const selAcc = accounts.find(a => a.id === formData.accountId);
                                                                    if (selAcc && selAcc.profiles && selAcc.profiles.length > 0) {
                                                                        selAcc.profiles.forEach((prof, idx) => {
                                                                            let count = requests.filter(r => r.accountId === formData.accountId && r.id !== formData.id && String(r.profilePosition) === String(idx + 1)).length;
                                                                            profileOptions.push({ label: `${prof.name || ('ملف ' + (idx + 1))} ${count > 0 ? '(بداخله '+count+')' : ''}`, value: String(idx + 1), disabled: false });
                                                                        });
                                                                    } else { profileOptions.push({ label: 'لا توجد ملفات', value: '', disabled: true }); }
                                                                }
                                                                return (<window.CustomSelect options={profileOptions} value={formData.profilePosition} onChange={(val) => { const updates = { profilePosition: val, profileName: '', profilePin: '' }; if (formData.accountId) { const selAcc = accounts.find(a => a.id === formData.accountId); if (selAcc && selAcc.profiles && selAcc.profiles[parseInt(val) - 1]) { const prof = selAcc.profiles[parseInt(val) - 1]; if (prof.name) updates.profileName = prof.name; if (prof.pin) updates.profilePin = prof.pin; } } setFormData({...formData, ...updates}); }} required={true} customClass="px-3 h-full text-sm font-bold" />);
                                                            })()}
                                                            </div>
                                                        </div>
                                                    );
                                                case 'reqPhone':
                                                    return (
                                                        <div key={req.id} className="col-span-1">
                                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">الجوال</label>
                                                            <div className="flex h-[46px] border border-[var(--glass-border)] bg-[var(--input-bg)] rounded-xl overflow-hidden focus-within:border-[var(--primary)] focus-within:shadow-[0_0_10px_rgba(56,189,248,0.2)] transition-all text-sm">
                                                                <input required type="tel" dir="ltr" value={formData.phoneNumber || ''} onChange={(e) => { let val = e.target.value.replace(/[^\d+]/g, ''); setFormData({...formData, phoneNumber: val}); }} className="w-full p-3 outline-none bg-transparent text-[var(--text-main)] text-sm text-left font-bold" />
                                                            </div>
                                                        </div>
                                                    );
                                                default: return null;
                                            }
                                        })}
                                        </div>
                                        <div className="col-span-1 mt-1">
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">المبلغ</label>
                                            <div className="h-[46px]"><window.CustomNumberInput value={formData.amountPaid} onChange={(val) => setFormData({...formData, amountPaid: val})} /></div>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'accounts' && (
                                    <>
                                        <div className="col-span-1">
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">اسم المستخدم</label>
                                            <input required type="text" dir="ltr" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-main)] rounded-xl p-3 h-[46px] text-left focus:border-[var(--primary)] focus:shadow-[0_0_10px_rgba(56,189,248,0.2)] outline-none transition-all text-sm font-bold" />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">كلمة المرور</label>
                                            <input type="text" dir="ltr" value={formData.password || ''} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-main)] rounded-xl p-3 h-[46px] text-left focus:border-[var(--primary)] focus:shadow-[0_0_10px_rgba(56,189,248,0.2)] outline-none transition-all text-sm font-bold" />
                                        </div>
                                        <div className="col-span-1 md:col-span-2 mt-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="block text-sm font-bold text-[var(--text-main)]">ملفات الحساب</label>
                                                <button type="button" onClick={() => { const newProfiles = [...(formData.profiles || []), { id: Date.now().toString(), name: '', pin: '' }]; setFormData({...formData, profiles: newProfiles}); }} className="text-[var(--primary)] hover:text-white text-xs font-bold transition-colors text-sm"><i className="fas fa-plus text-sm"></i> إضافة ملف</button>
                                            </div>
                                            {(formData.profiles || []).map((prof, index) => (
                                                <div key={prof.id} className="flex items-center gap-1.5 mb-2 bg-[var(--inner-bg)] p-1.5 rounded-xl border border-[var(--glass-border)] transition-all hover:border-[var(--primary)]">
                                                    <div className="flex flex-col gap-0 shrink-0 px-1">
                                                        <button type="button" onClick={() => moveProfile(index, -1)} disabled={index === 0} className="text-[var(--text-muted)] hover:text-[var(--primary)] disabled:opacity-20 transition-opacity p-0.5 leading-none"><i className="fas fa-chevron-up text-[10px]"></i></button>
                                                        <button type="button" onClick={() => moveProfile(index, 1)} disabled={index === (formData.profiles?.length || 0) - 1} className="text-[var(--text-muted)] hover:text-[var(--primary)] disabled:opacity-20 transition-opacity p-0.5 leading-none"><i className="fas fa-chevron-down text-[10px]"></i></button>
                                                    </div>
                                                    <div className="w-[1px] h-6 bg-[var(--glass-border)] mx-1"></div>
                                                    <input type="text" placeholder="الاسم" value={prof.name} onChange={(e) => { const newProfiles = [...formData.profiles]; newProfiles[index].name = e.target.value; setFormData({...formData, profiles: newProfiles}); }} className="w-full flex-1 bg-transparent border-none text-[var(--text-main)] outline-none text-sm px-1 font-bold placeholder:text-[var(--text-muted)] placeholder:font-normal" />
                                                    <div className="w-[1px] h-6 bg-[var(--glass-border)] mx-1"></div>
                                                    <input type="text" dir="ltr" placeholder="الرمز" value={prof.pin} onChange={(e) => { const newProfiles = [...formData.profiles]; newProfiles[index].pin = e.target.value; setFormData({...formData, profiles: newProfiles}); }} className="w-20 bg-transparent border-none text-[var(--text-main)] outline-none text-sm text-center font-bold placeholder:text-[var(--text-muted)] placeholder:font-normal" />
                                                    <div className="w-[1px] h-6 bg-[var(--glass-border)] mx-1"></div>
                                                    <div className="flex gap-1 shrink-0 px-1">
                                                        <button type="button" onClick={() => { const newProfiles = [...formData.profiles]; newProfiles.splice(index + 1, 0, { id: Date.now().toString(), name: prof.name, pin: prof.pin }); setFormData({...formData, profiles: newProfiles}); }} title="تكرار الملف" className="w-6 h-6 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--warning)] transition-colors"><i className="fas fa-copy text-xs"></i></button>
                                                        <button type="button" onClick={() => { const newProfiles = formData.profiles.filter((_, i) => i !== index); setFormData({...formData, profiles: newProfiles}); }} title="حذف الملف" className="w-6 h-6 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--error)] transition-colors"><i className="fas fa-trash-alt text-xs"></i></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 mt-1">
                                    <div className="col-span-1">
                                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">البدء</label>
                                        <div className="h-[46px]"><window.CustomDatePicker value={formData.startDate || ''} onChange={(val) => setFormData({...formData, startDate: val})} /></div>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">الانتهاء</label>
                                        <div className="h-[46px]"><window.CustomDatePicker disabled={activeTab !== 'accounts'} value={formData.endDate || ''} onChange={(val) => {if(activeTab === 'accounts') setFormData({...formData, endDate: val})}} /></div>
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2 mt-1">
                                    <label className="block text-sm font-bold text-[var(--text-main)] mb-2">ملاحظات</label>
                                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-main)] rounded-xl p-4 focus:border-[var(--primary)] focus:shadow-[0_0_10px_rgba(56,189,248,0.2)] outline-none transition-all min-h-[100px] text-sm" />
                                </div>
                                <div className="col-span-1 md:col-span-2 mt-4 flex justify-end gap-3 pt-5 border-t border-[var(--glass-border)]">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-[var(--text-main)] bg-[var(--input-bg)] hover:bg-[var(--hover-bg)] border border-[var(--glass-border)] transition-all font-bold text-sm"><i className="fas fa-times text-sm"></i></button>
                                    <button type="submit" className="px-6 py-3 rounded-xl text-white bg-gradient-to-l from-[var(--primary)] to-[var(--primary-hover)] hover:-translate-y-0.5 shadow-md transition-all font-bold flex items-center gap-2 text-sm"><i className="fas fa-save text-sm"></i></button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
            
            {confirmDialog.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-fadeIn">
                    <div className="admin-panel rounded-3xl w-full max-w-[420px] flex flex-col shadow-2xl p-7 border border-[var(--glass-border)]">
                        <div className="text-center mb-8 mt-2 flex flex-col items-center">
                            <div className="w-16 h-16 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(239,68,68,0.2)]"><i className="fas fa-exclamation-triangle text-3xl text-[var(--error)]"></i></div>
                            <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">{confirmDialog.message}</h3>
                        </div>
                        <div className="flex justify-center gap-3 mt-2">
                            <button onClick={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: null })} className="px-6 py-3 flex-1 rounded-xl text-[var(--text-main)] bg-[var(--input-bg)] hover:bg-[var(--hover-bg)] border border-[var(--glass-border)] transition-all font-bold text-sm"><i className="fas fa-times text-sm"></i></button>
                            <button onClick={() => { confirmDialog.onConfirm(); setConfirmDialog({ isOpen: false, message: '', onConfirm: null }); }} className="px-6 py-3 flex-1 rounded-xl text-white bg-[rgba(239,68,68,0.8)] hover:bg-[var(--error)] border border-[var(--error)] transition-all font-bold text-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"><i className="fas fa-check text-sm"></i></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

window.App = () => {
    const [user, setUser] = React.useState(null);
    const [isAuthLoading, setIsAuthLoading] = React.useState(true);
    React.useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((u) => { setUser(u); setIsAuthLoading(false); });
        return () => unsubscribe();
    }, []);
    if (isAuthLoading) return (<div className="flex items-center justify-center h-screen w-full relative z-10"><i className="fas fa-circle-notch fa-spin text-5xl text-[var(--primary)]"></i></div>);
    if (!user) return <window.LoginScreen auth={firebase.auth()} />;
    return <BrowserRouter><window.MainContent user={user} auth={firebase.auth()} database={firebase.database()} /></BrowserRouter>;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<window.App />);
