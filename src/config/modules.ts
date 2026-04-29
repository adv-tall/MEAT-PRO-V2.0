import {
    LayoutDashboard, Users, Clock, Sparkles, ShieldCheck, 
    GraduationCap, Target, UserPlus, Heart, BarChart3, 
    Database, CalendarDays, Settings, TerminalSquare,
    CalendarClock, ClipboardList, AlertTriangle, Factory, Settings2
} from 'lucide-react';

export const SYSTEM_MODULES = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'pro_calendar', label: 'PRO CALENDAR', icon: CalendarDays },
    { 
        id: 'planning', label: 'PLANNING', icon: CalendarClock, 
        subItems: [ 
            { id: 'plan_fr_planning', label: 'PLANNING (PL)' }, 
            { id: 'plan_by_prod', label: 'PRODUCTION PLANNING' } 
        ] 
    },
    { 
        id: 'daily_board', label: 'DAILY BOARD', icon: ClipboardList,
        subItems: [ 
            { id: 'prod_tracking', label: 'PRODUCTION TRACKING' }, 
            { id: 'mixing_plan', label: 'MIXING BOARD' }, 
            { id: 'packing_plan', label: 'PACKING BOARD' } 
        ] 
    },
    { 
        id: 'daily_problem', label: 'DAILY PROBLEM', icon: AlertTriangle,
        subItems: [ 
            { id: 'unplanned_jobs', label: 'UNPLANNED JOBS' }, 
            { id: 'machine_breakdown', label: 'MACHINE BREAKDOWN' } 
        ] 
    },
    { 
        id: 'process', label: 'PROCESS', icon: Factory,
        subItems: [ 
            { id: 'premix', label: 'PREMIX' }, 
            { id: 'mixing', label: 'MIXING' }, 
            { id: 'forming', label: 'FORMING' }, 
            { id: 'cooking', label: 'COOKING' }, 
            { id: 'cooling', label: 'COOLING' }, 
            { id: 'cut_peel', label: 'CUT & PEEL' }, 
            { id: 'packing', label: 'PACKING' } 
        ] 
    },
    { 
        id: 'prod_config', label: 'PROD CONFIG', icon: Settings2,
        subItems: [ 
            { id: 'master_item', label: 'MASTER ITEM' },
            { id: 'product_matrix', label: 'PRODUCT MATRIX' },
            { id: 'meat_formula', label: 'MEAT FORMULA' }, 
            { id: 'std_process_time', label: 'STD PROCESS TIME' }, 
            { id: 'equipment_registry', label: 'EQUIPMENT REGISTRY' },
            { id: 'config', label: 'CONFIG' } 
        ] 
    },
    {
        id: 'setting', label: 'SETTING', icon: Settings,
        subItems: [
            { id: 'user_permission', label: 'USER PERMISSIONS' },
            { id: 'system_config', label: 'SYSTEM CONFIG' },
            { id: 'dev_permit', label: 'DEV PERMIT (BETA)' }
        ]
    }
];
