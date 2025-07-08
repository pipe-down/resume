// Timeline initialization function - 먼저 정의
window.initializeTimeline = function() {
    console.log('initializeTimeline function called');
    const timelineContainer = document.getElementById('timeline-container');
    const detailsPanel = document.getElementById('experience-details');
    
    // 디버깅을 위한 콘솔 로그
    console.log('Timeline container:', timelineContainer);
    console.log('Details panel:', detailsPanel);
    console.log('Company experience data:', window.companyExperienceData);
    
    if (!timelineContainer || !detailsPanel) {
        console.error('Timeline container or details panel not found!');
        return;
    }

    if (!window.companyExperienceData || !window.experienceData) {
        console.error('Experience data not found!');
        return;
    }

    function displayExperienceDetails(id) {
        const experience = window.experienceData.find(exp => exp.id === id);
        if (!experience) return;

        detailsPanel.innerHTML = `
            <h3 class="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1.5">${experience.title}</h3>
            <p class="text-xs sm:text-sm font-semibold text-gray-700 mb-0.5">${experience.company}</p>
            <p class="text-xs text-gray-500 mb-2 sm:mb-3">${experience.period}</p>
            <p class="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 leading-relaxed">${experience.description}</p>
            <h4 class="font-bold mb-2 text-gray-800 text-xs sm:text-sm">🎯 주요 성과</h4>
            <ul class="space-y-1.5 mb-4 sm:mb-5">
                ${experience.achievements.map(ach => `<li class="flex items-start text-xs"><span class="text-green-500 mr-1.5 mt-0.5 flex-shrink-0" style="font-size: 10px;">✓</span><span class="text-gray-700 leading-relaxed">${ach}</span></li>`).join('')}
            </ul>
            <h4 class="font-bold mb-1.5 text-gray-800 text-xs sm:text-sm">🛠️ 사용 기술</h4>
            <div class="flex flex-wrap gap-1">
                ${experience.tech.map(t => `<span class="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded" style="font-size: 11px;">${t}</span>`).join('')}
            </div>
        `;
        
        // Update active state
        document.querySelectorAll('.timeline-item-container').forEach(el => {
            el.classList.remove('active-timeline');
            if (el.dataset.id === id) {
                el.classList.add('active-timeline');
            }
        });
    }

    // 회사 로고 매핑
    const companyLogos = {
        '디케이테크인': 'assets/logos/dkt.png',
        '세정아이앤씨': 'assets/logos/sjinc.jpg'
    };

    // Company-based timeline rendering
    window.companyExperienceData.forEach((company, companyIndex) => {
        const companyContainer = document.createElement('div');
        companyContainer.className = 'company-container mb-4 relative';
        
        // Company header
        const companyHeader = document.createElement('div');
        companyHeader.className = 'company-header mb-3 cursor-pointer p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-300';
        const logoUrl = companyLogos[company.company];
        const logoElement = logoUrl 
            ? `<img src="${logoUrl}" alt="${company.company}" class="w-10 h-10 object-contain" onerror="this.onerror=null; this.src='https://via.placeholder.com/40x40/e5e7eb/9ca3af?text=${company.company.charAt(0)}'">`
            : `<div class="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 font-bold text-sm">
                   ${company.company.charAt(0)}
               </div>`;
               
        companyHeader.innerHTML = `
            <div class="flex items-center gap-3">
                ${logoElement}
                <div class="flex-1">
                    <h3 class="font-bold text-sm sm:text-base text-gray-900">${company.company}</h3>
                    <p class="text-xs sm:text-sm text-gray-600 mt-0.5">${company.position} • ${company.period}</p>
                </div>
                <i class="fas fa-chevron-down text-gray-400 transition-transform duration-300 text-sm" data-company-index="${companyIndex}"></i>
            </div>
        `;
        
        // Project list container
        const projectList = document.createElement('div');
        projectList.className = 'project-list ml-4';
        projectList.style.display = companyIndex === 0 ? 'block' : 'none'; // 첫 번째 회사는 기본적으로 열림
        
        // Add projects
        company.projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'timeline-item-container mb-2 cursor-pointer p-2 sm:p-3 border border-transparent rounded-lg hover:bg-gray-50 transition-all duration-300';
            projectItem.dataset.id = project.id;
            projectItem.innerHTML = `
                <div class="timeline-item relative pl-3 -ml-[2px] transition-all duration-200">
                    <h4 class="font-semibold text-xs sm:text-sm text-gray-800" style="word-break: keep-all; line-height: 1.3;">${project.title}</h4>
                    <p class="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                        <i class="far fa-calendar-alt text-gray-400" style="font-size: 11px;"></i>
                        ${project.period}
                    </p>
                </div>
            `;
            projectItem.addEventListener('click', () => displayExperienceDetails(project.id));
            projectList.appendChild(projectItem);
        });
        
        // Toggle company projects
        companyHeader.addEventListener('click', () => {
            const icon = companyHeader.querySelector('i');
            const isOpen = projectList.style.display === 'block';
            
            // Close all other companies
            document.querySelectorAll('.project-list').forEach(list => {
                list.style.display = 'none';
            });
            document.querySelectorAll('.company-header i').forEach(i => {
                i.style.transform = 'rotate(0deg)';
            });
            
            // Toggle current company
            if (!isOpen) {
                projectList.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
                // Auto-select first project when opening
                if (company.projects.length > 0) {
                    displayExperienceDetails(company.projects[0].id);
                }
            }
        });
        
        companyContainer.appendChild(companyHeader);
        companyContainer.appendChild(projectList);
        timelineContainer.appendChild(companyContainer);
    });
    
    // 첫 번째 프로젝트 자동 선택
    if (window.companyExperienceData.length > 0 && window.companyExperienceData[0].projects.length > 0) {
        displayExperienceDetails(window.companyExperienceData[0].projects[0].id);
    }
    
    // Auto-open first company's first project
    if (window.companyExperienceData.length > 0 && window.companyExperienceData[0].projects.length > 0) {
        const firstIcon = timelineContainer.querySelector('.company-header i');
        if (firstIcon) firstIcon.style.transform = 'rotate(180deg)';
    }

    // Display the first item by default
    if (window.experienceData.length > 0) {
        displayExperienceDetails(window.experienceData[0].id);
    }

    // Create print-only experience sections with 2-column grid layout
    const printContainer = document.querySelector('.experience-print-container');
    if (printContainer) {
        // 회사별로 그룹화하여 출력
        window.companyExperienceData.forEach(company => {
            // 회사 그룹 컨테이너 생성
            const companyGroup = document.createElement('div');
            companyGroup.className = 'company-group';
            
            // 회사 헤더 추가 (선택사항)
            const companyHeader = document.createElement('div');
            companyHeader.className = 'company-header-print';
            companyHeader.innerHTML = `
                <h3 style="font-size: 0.875rem; font-weight: 700; color: #111827; margin-bottom: 0.25rem;">
                    ${company.company}
                </h3>
                <p style="font-size: 0.625rem; color: #6b7280;">
                    ${company.position} • ${company.period}
                </p>
            `;
            companyGroup.appendChild(companyHeader);
            
            // 프로젝트들을 그리드에 추가
            const projectsGrid = document.createElement('div');
            projectsGrid.style.display = 'grid';
            projectsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            projectsGrid.style.gap = '0.5rem';
            
            company.projects.forEach(project => {
                const exp = window.experienceData.find(e => e.id === project.id);
                if (exp) {
                    const printSection = document.createElement('div');
                    printSection.className = 'experience-print-section';
                    printSection.innerHTML = `
                        <h3>${exp.title}</h3>
                        <p class="period">${exp.period}</p>
                        <p class="description">${exp.description}</p>
                        <h4>주요 성과</h4>
                        <ul>
                            ${exp.achievements.map(ach => `<li><span style="color: #10b981;">✓</span><span>${ach}</span></li>`).join('')}
                        </ul>
                        <h4>사용 기술</h4>
                        <div class="tech-stack">
                            ${exp.tech.map(t => `<span>${t}</span>`).join('')}
                        </div>
                    `;
                    projectsGrid.appendChild(printSection);
                }
            });
            
            companyGroup.appendChild(projectsGrid);
            printContainer.appendChild(companyGroup);
        });
    }
};

// DOMContentLoaded 이벤트가 이미 발생했는지 확인
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOMContentLoaded가 이미 발생한 경우
    console.log('DOM already loaded, initializing app directly');
    initializeApp();
}

function initializeApp() {
    console.log('Initializing app...');
    // GitHub Pages 환경 체크
    const isGitHubPages = window.location.hostname.includes('github.io');
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // 향상된 관리자 인증 시스템
    class AdminAuth {
        constructor() {
            this.sessionKey = 'adminSession';
            this.accessKey = 'a7B9x2mN4pQ8rT6uY3wZ5vC1kL0'; // 복잡한 액세스 키
            this.sessionTimeout = 30 * 60 * 1000; // 30분
        }

        authenticate(key) {
            if (key === this.accessKey) {
                const session = {
                    authenticated: true,
                    timestamp: Date.now(),
                    fingerprint: this.generateFingerprint()
                };
                
                sessionStorage.setItem(this.sessionKey, btoa(JSON.stringify(session)));
                return true;
            }
            return false;
        }

        isAuthenticated() {
            try {
                const encrypted = sessionStorage.getItem(this.sessionKey);
                if (!encrypted) return false;

                const session = JSON.parse(atob(encrypted));
                const now = Date.now();

                // 타임아웃 체크
                if (now - session.timestamp > this.sessionTimeout) {
                    this.logout();
                    return false;
                }

                // 핑거프린트 검증
                if (session.fingerprint !== this.generateFingerprint()) {
                    this.logout();
                    return false;
                }

                return session.authenticated === true;
            } catch {
                return false;
            }
        }

        generateFingerprint() {
            const data = [
                navigator.userAgent,
                navigator.language,
                screen.width + 'x' + screen.height,
                new Date().getTimezoneOffset()
            ].join('|');
            
            return btoa(data);
        }

        logout() {
            sessionStorage.removeItem(this.sessionKey);
        }
    }

    // 관리자 인증 인스턴스 생성
    const adminAuth = new AdminAuth();
    
    // URL 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const accessKey = urlParams.get('key');
    
    // 액세스 키가 있으면 인증 시도
    if (accessKey) {
        if (adminAuth.authenticate(accessKey)) {
            // 인증 성공 후 URL에서 키 제거
            window.history.replaceState({}, document.title, window.location.pathname);
            console.log('관리자 인증 성공');
        } else {
            console.warn('잘못된 액세스 키');
        }
    }
    
    // 관리자 모드 확인
    const isAdminMode = adminAuth.isAuthenticated();
    
    // adminAuth를 전역으로 사용할 수 있도록 설정
    window.adminAuth = adminAuth;
    
    // GitHub Pages 환경에서는 편집 및 설정 버튼 숨기기 (관리자 모드가 아닌 경우)
    if (isGitHubPages && !isLocalDev && !isAdminMode) {
        // 편집 버튼 숨기기
        const editButton = document.getElementById('editButton');
        if (editButton) {
            editButton.style.display = 'none';
        }
        
        // 설정 버튼 컨테이너 숨기기
        const settingsContainer = document.querySelector('div[style*="bottom: 1rem; left: 1rem"]');
        if (settingsContainer) {
            settingsContainer.style.display = 'none';
        }
        
        // 편집 관련 클래스들 제거 (보안 강화)
        document.querySelectorAll('.editable').forEach(el => {
            el.classList.remove('editable');
            el.removeAttribute('contenteditable');
        });
        
    }

    // --- DATA ---

    const companyExperienceData = [
        {
            company: '디케이테크인',
            period: '2022.05 - 현재',
            position: '백엔드 엔지니어',
            description: '카카오 계열사 IT 서비스 전문 기업에서<br>다양한 프로젝트의 백엔드 개발을 담당하고 있습니다.',
            projects: [
                { id: 'sm_gw', period: '2025.01 - 2025.06', title: 'SM엔터테인먼트 그룹웨어 SAP 고도화', description: 'SM Ent 그룹웨어 전자결재 시스템과 SAP 연동 고도화 프로젝트<br>공통 모듈 개발 및 연동 프로세스 개선을 담당했습니다.', achievements: ['CO, SA, MM 모듈 SAP RFC 연동 개발<br>• 결재 비동기 처리로 시스템 성능 및 안정성 확보', 'Jxls 활용 공통 엑셀 다운로드 유틸 개발<br>• 코드 재사용성 향상 및 유지보수 효율 개선', 'SAP 연동 공통 모듈 개발<br>• 연동 개발 리소스 <span class="font-semibold text-red-600">50% 이상 단축</span>', 'LLM을 활용한 테스트 코드 작성 방안 연구<br>• 팀의 기술적 성장 도모'], tech: ['Java', 'Spring Boot', 'JPA', 'SAP RFC', 'MySQL', 'Kubernetes', 'Vue.js'] },
                { id: 'dkt_pms_all', period: '2024.06 - 2024.12', title: 'DKT 프로젝트 매니징 시스템(PMS) 2.7 구축', description: '사내 프로젝트 관리 시스템(PMS) 2.7 버전 구축 프로젝트에서<br>서비스 개발 및 핵심 성능 최적화를 담당했습니다.', achievements: ['발주 검색 로직 리팩토링<br>• 응답 시간 <span class="font-semibold text-red-600">20초 → 0.1초</span> (99.5% 단축)', '병렬 처리 도입<br>• 프로젝트 현황 계산 <span class="font-semibold text-red-600">16초 → 1초</span> (93.7% 감소)', 'N+1 문제 해결 및 쿼리 최적화<br>• 프로젝트 조회 성능 <span class="font-semibold text-red-600">30초 → 1초</span> (96.7% 개선)', '프로젝트 히스토리 기능 개발<br>• 변경 이력 관리 및 추적성 강화', '체계적인 데이터 마이그레이션 및 bulk insert 적용<br>• 대량 데이터 처리 성능 향상', '일정 단축 달성<br>• <span class="font-semibold text-green-600">50MD → 43MD</span> 및 FT 작업 동시 진행'], tech: ['Java', 'Spring Boot', 'JPA', 'QueryDSL', 'MySQL', 'Kubernetes', 'Vue.js'] },
                { id: 'kakao_am', period: '2024.02 - 2024.06', title: '카카오모빌리티 자산관리시스템 구축', description: '카카오모빌리티 사내 자산관리 시스템을 신규 구축하며<br>DevOps, DB 마이그레이션 등을 담당했습니다.', achievements: ['Kubernetes 기반 인프라 환경 설계 및 Helm Chart 구성<br>• 배포 자동화 및 운영 효율성 증대', 'Spring Boot 3.3.3, JDK 17 버전 업그레이드<br>• 시스템 최신성 유지 및 보안 강화', 'SSO 로그인 도입 및 통합 인증 시스템 구축<br>• 보안성 및 사용자 편의성 동시 달성', 'Zebra 프린터 연동 개발<br>• 자산 라벨링 및 관리 프로세스 자동화', '대용량 수기 관리 데이터 마이그레이션<br>• Temp Table 및 Join Update 방식으로 안정적 이관'], tech: ['Java', 'Spring Boot', 'JPA', 'MySQL', 'Kubernetes', 'D2hub', 'Vue.js'] },
                { id: 'kakao_cr', period: '2023.09 - 2024.03', title: '카카오 캠퍼스 예약 코어시스템 개발', description: '카카오 신규 사옥의 예약 시스템 코어 개발에 참여하여<br>대용량 트랜잭션 처리 및 동시성 제어를 담당했습니다.', achievements: ['JdbcTemplate BatchUpdate 적용으로 재고 데이터 생성 성능 획기적 개선.', 'Entity 관계 설계 최적화 및 QueryDSL Projections 활용으로 N+1 문제를 원천적으로 해결.', 'Redisson 분산 락(Distributed Lock) 구현을 통해 예약 채번 프로세스의 동시성 이슈 해결 및 데이터 정합성 확보.', '사용자 테이블 이원화 대응 및 Subselect 활용으로 기존 코드 영향도 최소화.'], tech: ['Java', 'Spring Boot', 'JPA', 'Redisson', 'MySQL', 'GitLab'] },
                { id: 'dkt_internal_all', period: '2022.05 - 현재', title: 'DKT 사내시스템 통합 개발 및 운영', description: '하루, 휴가, IDC캘린더, 자원예약, 프라이데이 연동 등<br>다양한 사내 시스템의 개발 및 운영을 통합 관리하고 있습니다.', achievements: ['휴가 신청 성능 최적화<br>• <span class="font-semibold text-red-600">15초 → 1-3초</span> (80% 이상 개선)', '월 근무 내역 조회 성능 개선<br>• <span class="font-semibold text-red-600">6초 → 1초</span> (인덱스 최적화)', '프라이데이-하루 시스템 연동<br>• 월 10만건 이상 데이터 동기화 안정화', '부서별 권한 체계 개선<br>• 자원예약 시스템 권한 관리 고도화', 'N+1 문제 체계적 해결<br>• 전체 시스템 API 성능 향상', '보안 강화<br>• EOL 대응 및 개인정보영향평가 수행'], tech: ['Java', 'Spring Boot', 'JPA', 'QueryDSL', 'MySQL', 'REST API'] },
            ]
        },
        {
            company: '세정아이앤씨',
            period: '2018.09 - 2021.06',
            position: '풀스택 개발자',
            description: '그룹사 통합 인사 시스템 및 주얼리 브랜드의 차세대 ERP/POS 시스템 개발과 운영을 담당했습니다.',
            projects: [
                { id: 'sejung_ep', period: '2020.05 - 2021.06', title: 'EP 통합 인사 시스템 개발 및 유지보수', description: '세정그룹 통합 인사, 회계 시스템 개발 및 유지보수를 담당했습니다.', achievements: ['영업지원 업무 관리 시스템 구현으로 POS-EP 연동을 통해 매장과 담당자간 업무 프로세스 간소화.', '계열사 간 퇴직금 이관 관리 시스템 구현으로 관계사 전출시 퇴직금 이관 및 정산 프로세스 자동화.', '당직 근무 자동화 시스템 구현으로 수기 작성하던 당직 근무 관리를 시스템화.', '사내 결재 시스템과 연동된 휴가, 출장, 연장근로 등 근태관리 시스템 구현.', 'IPT 전화기 재고관리 시스템 구현 및 2020년도 연말정산 시스템 작업 수행.', '삼성SDS ACUBE 기반 EP 시스템 관리 및 성과 관리 시스템 개발/유지보수.'], tech: ['Java', 'JSP', 'Oracle DB', 'JavaScript', 'Spring Framework', 'Git'] },
                { id: 'sejung_jewelry', period: '2019.01 - 2019.07', title: '주얼리 브랜드 ERP/POS 시스템 개편', description: '주얼리 브랜드의 ERP, POS 시스템 개편 프로젝트 개발 및 오픈 지원을 담당했습니다.', achievements: ['C# 클라이언트와 Spring Framework 서버 기반의 차세대 시스템 구축에 참여.', '수출업무 단위 화면 개발로 해외 거래 프로세스 효율화.', '고객관리 업무 화면 개발로 CRM 기능 강화.', '레거시 시스템의 문자 인증 기능을 신규 시스템에 안정적으로 마이그레이션.'], tech: ['Java', 'JSP', 'Oracle DB', 'JavaScript', 'Spring Framework', 'C#', 'DevExpress', 'WinForm', '.NET', 'SVN'] },
                { id: 'sejung_erp_pos', period: '2018.09 - 2020.05', title: 'ERP 및 POS 시스템 개발 및 유지보수', description: '그룹사 ERP 및 의류매장 POS 시스템 개발 및 운영을 담당했습니다.', achievements: ['매장간 사이즈이동 프로그램 신규개발로 일평균 800건의 매장간 교환 프로세스를 효율화하여 물량회전 강화에 기여.', 'GC 관련 객체 생성 최소화로 메모리 사용량 개선 (String → StringBuilder/StringBuffer 전환).', 'POS 판매 프로세스 개선을 위해 분산된 프로시저를 통합하여 트랜잭션 처리 속도 향상.', '영업, 채권 관련 ERP 시스템 관리 및 Oracle DB 기반 매장간 제품 로테이션 프로시저 개발.', '성능 향상을 위한 쿼리 튜닝으로 대용량 데이터 처리 속도 개선.'], tech: ['Java', 'JSP', 'Oracle DB', 'JavaScript', 'Spring Framework', 'C#', 'DevExpress', 'WinForm', '.NET', 'SVN'] },
            ]
        }
    ];
    
    // 기존 experienceData와의 호환성을 위한 flatten
    const experienceData = companyExperienceData.flatMap(company => 
        company.projects.map(project => ({
            ...project,
            company: company.company
        }))
    );
    
    // 전역 변수로 설정
    window.companyExperienceData = companyExperienceData;
    window.experienceData = experienceData;
    
    // Call timeline initialization after data is defined
    console.log('About to call initializeTimeline');
    console.log('companyExperienceData:', window.companyExperienceData);
    console.log('experienceData:', window.experienceData);
    window.initializeTimeline();

    const performanceData = {
        labels: [
            '발주 검색\n(20s → 0.1s)', 
            '프로젝트 현황\n(16s → 1s)', 
            '프로젝트 조회\n(30s → 1s)', 
            'GetMoim Latency\n(200ms → 40ms)',
            'AI 코드 생산성\n(100% → 320%)', 
            'SAP 연동\n(100% → 50%)'
        ],
        datasets: [
            {
                label: '개선 전',
                data: [20, 16, 30, 0.2, 100, 100],
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 2,
                borderRadius: 8
            },
            {
                label: '개선 후',
                data: [0.1, 1, 1, 0.04, 320, 50],
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2,
                borderRadius: 8
            }
        ]
    };


    // --- CHARTS ---

    // 성능 차트 제거됨
    /*
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    new Chart(performanceCtx, {
        type: 'bar',
        data: performanceData,
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 20
                    }
                },
                title: {
                    display: false
                },
                datalabels: {
                    display: function(context) {
                        return context.datasetIndex === 1; // 개선 후 데이터만 표시
                    },
                    anchor: 'end',
                    align: 'top',
                    offset: 10,
                    formatter: function(value, context) {
                        let index = context.dataIndex;
                        let beforeValue = performanceData.datasets[0].data[index];
                        let improvement;
                        
                        if (index === 4) { // AI 코드 생산성
                            improvement = ((value / beforeValue - 1) * 100).toFixed(0) + '%';
                            return '↑' + improvement;
                        } else {
                            improvement = ((beforeValue - value) / beforeValue * 100).toFixed(1) + '%';
                            return '↓' + improvement;
                        }
                    },
                    color: 'white',
                    backgroundColor: function(context) {
                        let index = context.dataIndex;
                        if (index === 4) { // AI 코드 생산성
                            return 'rgba(34, 197, 94, 0.9)';
                        } else {
                            return 'rgba(59, 130, 246, 0.9)';
                        }
                    },
                    borderRadius: 4,
                    padding: 6,
                    font: {
                        weight: 'bold',
                        size: 12
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            let index = context.dataIndex;
                            let value = context.parsed.y;
                            
                            if (label) {
                                label += ': ';
                            }
                            
                            if (index === 3) {
                                // GetMoim P95 Latency는 ms 단위
                                label += value + 'ms';
                            } else if (index === 4) {
                                // AI 코드 생산성은 퍼센트로 표시
                                label += value + '%';
                                if (context.datasetIndex === 0) {
                                    label += ' (기준 생산성)';
                                } else {
                                    label += ' (AI 활용 후)';
                                }
                            } else if (index === 5) {
                                // SAP 연동 개발은 리소스(퍼센트)로 표시
                                label += value + '%';
                                if (context.datasetIndex === 0) {
                                    label += ' (기준 리소스)';
                                } else {
                                    label += ' (개선 후 리소스)';
                                }
                            } else {
                                // 나머지는 초 단위
                                label += value + '초';
                            }
                            
                            // 개선율 표시
                            if (context.datasetIndex === 1) {
                                let beforeValue = context.chart.data.datasets[0].data[index];
                                if (beforeValue > 0) {
                                    let improvement;
                                    if (index === 4) { // AI 코드 생산성
                                        improvement = ((value / beforeValue - 1) * 100).toFixed(0);
                                        label += ' (+' + improvement + '%)';
                                    } else {
                                        improvement = ((beforeValue - value) / beforeValue * 100).toFixed(1);
                                        label += ' (-' + improvement + '%)';
                                    }
                                }
                            }
                            
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'logarithmic',
                    title: {
                        display: false
                    },
                    ticks: {
                        callback: function(value, index) {
                            // 로그 스케일 눈금 표시 개선
                            if (value === 0.01) return '0.01';
                            if (value === 0.1) return '0.1';
                            if (value === 1) return '1';
                            if (value === 10) return '10';
                            if (value === 100) return '100';
                            if (value === 1000) return '1000';
                            return null;
                        },
                        font: {
                            size: 11
                        }
                    },
                    min: 0.01,
                    max: 1000
                },
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0,
                        padding: 5,
                        font: {
                            size: 10
                        },
                        callback: function(value, index) {
                            // 이미 라벨에 개선 전후 값이 포함되어 있으므로 그대로 반환
                            return this.getLabelForValue(value);
                        }
                    }
                }
            }
        }
    });
    */

}

// Timeline initialization after DOM is fully loaded
window.addEventListener('load', function() {
    console.log('Window loaded, checking timeline initialization');
    const timelineContainer = document.getElementById('timeline-container');
    if (timelineContainer && timelineContainer.children.length === 0) {
        // Check if data is available
        if (window.companyExperienceData && window.experienceData) {
            console.log('Data is available, calling initializeTimeline');
            window.initializeTimeline();
        } else {
            console.log('Data not yet available, waiting...');
            // Try again after a short delay
            setTimeout(function() {
                if (window.companyExperienceData && window.experienceData) {
                    console.log('Data now available, calling initializeTimeline');
                    window.initializeTimeline();
                } else {
                    console.error('Data still not available after waiting');
                }
            }, 500);
        }
    }
});

// PDF Export Function
function exportToPDF() {
    // 현재 날짜 가져오기
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    // 파일명 설정
    const filename = `박정호_백엔드엔지니어_이력서_${dateStr}`;
    
    // 버튼 텍스트 변경
    const button = document.querySelector('.pdf-button');
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>준비 중...</span>';
    button.style.pointerEvents = 'none';
    
    // 인쇄 준비 시간
    setTimeout(() => {
        // 브라우저 인쇄 기능 호출
        window.print();
        
        // 버튼 텍스트 복원
        button.innerHTML = originalHTML;
        button.style.pointerEvents = 'auto';
        
        // 성공 메시지 표시
        showNotification('🎉 PDF 내보내기 준비 완료! 인쇄 대화상자에서 PDF로 저장하세요.');
    }, 300);
}

// 알림 메시지 표시
function showNotification(message) {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification-toast fixed top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3';
    notification.style.transform = 'translate(-50%, -20px)';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease-out';
    notification.innerHTML = `
        <i class="fas fa-check-circle text-xl"></i>
        <span class="font-medium">${message}</span>
    `;
    document.body.appendChild(notification);
    
    // 페이드 인 애니메이션
    requestAnimationFrame(() => {
        notification.style.transform = 'translate(-50%, 0)';
        notification.style.opacity = '1';
    });
    
    // 페이드 아웃 및 제거
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// 키보드 단축키 (Ctrl/Cmd + P)
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        exportToPDF();
    }
});

// Smooth scroll to center active navigation item on mobile
function centerActiveNavItem() {
    if (window.innerWidth <= 768) {
        const activeItem = document.querySelector('.nav-item.active');
        const nav = document.querySelector('nav');
        
        if (activeItem && nav) {
            const activeItemRect = activeItem.getBoundingClientRect();
            const navRect = nav.getBoundingClientRect();
            const scrollLeft = nav.scrollLeft;
            const activeItemCenter = activeItemRect.left + activeItemRect.width / 2 - navRect.left;
            const navCenter = navRect.width / 2;
            
            nav.scrollTo({
                left: scrollLeft + activeItemCenter - navCenter,
                behavior: 'smooth'
            });
        }
    }
}

// Update active nav item on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').substring(1) === current) {
            item.classList.add('active');
        }
    });
    
    centerActiveNavItem();
});

// Edit Mode Functionality
let isEditMode = false;

function toggleEditMode() {
    // GitHub Pages에서 관리자 모드가 아닌 경우 편집 차단
    const isGitHubPages = window.location.hostname.includes('github.io');
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
    const isAdminMode = window.adminAuth ? window.adminAuth.isAuthenticated() : false;
    
    if (isGitHubPages && !isLocalDev && !isAdminMode) {
        alert('편집 권한이 없습니다.');
        return;
    }
    
    isEditMode = !isEditMode;
    const editMenuText = document.getElementById('editMenuText');
    const editNotification = document.getElementById('editNotification');
    const editables = document.querySelectorAll('.editable');
    const techCards = document.querySelectorAll('.editable-tech');
    const addTechBtns = document.querySelectorAll('.add-tech-btn');
    
    if (isEditMode) {
        // 편집 모드 활성화
        if (editMenuText) {
            editMenuText.textContent = '편집 종료';
        }
        if (editNotification) {
            editNotification.classList.add('active');
        }
        
        // 모든 편집 가능한 요소에 contenteditable 속성 추가
        editables.forEach(element => {
            element.setAttribute('contenteditable', 'true');
            element.setAttribute('spellcheck', 'false');
            
            // 원본 내용 저장
            element.dataset.original = element.innerHTML;
            
            // 포커스 이벤트 추가
            element.addEventListener('focus', handleFocus);
            element.addEventListener('blur', handleBlur);
            element.addEventListener('paste', handlePaste);
        });
        
        // 기술 스택 편집 활성화
        const techItems = document.querySelectorAll('.tech-item');
        techItems.forEach(item => {
            const span = item.querySelector('span');
            const removeBtn = item.querySelector('.tech-remove');
            
            if (span) {
                span.setAttribute('contenteditable', 'true');
                span.setAttribute('spellcheck', 'false');
            }
            if (removeBtn) {
                removeBtn.style.display = 'block';
            }
        });
        
        // 기술 추가 버튼 표시
        const techAdd = document.querySelector('.tech-add');
        if (techAdd) {
            techAdd.style.display = 'inline-flex';
        }
        
        // 편집 모드 안내 메시지
        showNotification('편집 모드가 활성화되었습니다. 텍스트를 클릭하여 수정하세요.');
    } else {
        // 편집 모드 비활성화
        if (editMenuText) {
            editMenuText.textContent = '편집 모드';
        }
        if (editNotification) {
            editNotification.classList.remove('active');
        }
        
        // 모든 편집 가능한 요소에서 contenteditable 속성 제거
        editables.forEach(element => {
            element.removeAttribute('contenteditable');
            
            // 이벤트 리스너 제거
            element.removeEventListener('focus', handleFocus);
            element.removeEventListener('blur', handleBlur);
            element.removeEventListener('paste', handlePaste);
        });
        
        // 기술 스택 편집 비활성화
        const techItems = document.querySelectorAll('.tech-item');
        techItems.forEach(item => {
            const span = item.querySelector('span');
            const removeBtn = item.querySelector('.tech-remove');
            
            if (span) {
                span.removeAttribute('contenteditable');
            }
            if (removeBtn) {
                removeBtn.style.display = 'none';
            }
        });
        
        // 기술 추가 버튼 숨기기
        const techAdd = document.querySelector('.tech-add');
        if (techAdd) {
            techAdd.style.display = 'none';
        }
        
        // 변경사항 저장
        saveChanges();
    }
}

function handleFocus(e) {
    // 텍스트 전체 선택
    const range = document.createRange();
    range.selectNodeContents(e.target);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

function handleBlur(e) {
    // 빈 내용 방지
    if (e.target.textContent.trim() === '') {
        e.target.innerHTML = e.target.dataset.original;
    }
}

function handlePaste(e) {
    // 붙여넣기 시 서식 제거
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    document.execCommand('insertHTML', false, text);
}

function saveChanges() {
    const resumeData = collectAllData();
    resumeData.version = "1.0";
    resumeData.lastModified = new Date().toISOString();
    
    // localStorage에 저장
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    
    showNotification('변경사항이 저장되었습니다!');
}

// 모든 데이터 수집 함수
function collectAllData() {
    // 모든 editable 요소들을 수집
    const editables = Array.from(document.querySelectorAll('.editable'));
    
    const resumeData = {
        personalInfo: {
            name: document.querySelector('h1.editable')?.textContent || '박정호',
            title: document.querySelector('header p.editable')?.textContent || '백엔드 엔지니어',
            years: document.querySelector('.text-right .editable')?.textContent || '7년차 개발자',
            email: document.querySelector('.fa-envelope').parentElement.querySelector('.editable')?.textContent || 'pjhsk00@naver.com',
            location: document.querySelector('.fa-map-marker-alt').parentElement.querySelector('.editable')?.textContent || '판교, 대한민국',
            jobType: document.querySelector('.fa-code').parentElement.querySelector('.editable')?.textContent || '풀스택 개발 가능',
            availability: document.querySelector('.fa-calendar-check').parentElement.querySelector('.editable')?.textContent || '즉시 근무 가능',
            summary: document.querySelector('#summary .editable')?.innerHTML || '경력 요약'
        },
        techStacks: {},
        projects: [],
        keyMetrics: [],
        experience: window.companyExperienceData || [],
        education: {},
        certifications: []
    };
    
    // 기술 스택 수집 (카테고리별로)
    document.querySelectorAll('.tech-stack-container').forEach(container => {
        const category = container.dataset.category;
        resumeData.techStacks[category] = Array.from(container.querySelectorAll('.editable-tech')).map(tech => tech.textContent);
    });
    
    // 프로젝트 데이터 수집
    document.querySelectorAll('#projects .card').forEach(projectCard => {
        const titleEl = projectCard.querySelector('.editable');
        if (titleEl) {
            const techTags = Array.from(projectCard.querySelectorAll('span.text-xs.px-1\\.5')).map(badge => badge.textContent);
            
            resumeData.projects.push({
                title: titleEl.textContent,
                period: projectCard.querySelectorAll('.editable')[1]?.textContent || '',
                description: projectCard.querySelectorAll('.editable')[2]?.textContent || '',
                tech: techTags,
                link: projectCard.querySelector('a')?.href || ''
            });
        }
    });
    
    // 핵심 성과 데이터 수집
    document.querySelectorAll('#impact .bg-white.border').forEach((card) => {
        const titleEl = card.querySelector('h4');
        const valueEl = card.querySelector('p.text-2xl');
        const detailEl = card.querySelector('p.text-xs');
        
        if (titleEl && valueEl) {
            resumeData.keyMetrics.push({
                title: titleEl.textContent,
                value: valueEl.textContent,
                detail: detailEl?.textContent || ''
            });
        }
    });
    
    // 경력 데이터는 이미 window.companyExperienceData에서 가져옴
    
    // 학력 정보 수집
    const educationSection = document.querySelector('#education-cert');
    if (educationSection) {
        resumeData.education = {
            school: educationSection.querySelector('.education-school')?.textContent || '',
            major: educationSection.querySelector('.education-major')?.textContent || '',
            period: educationSection.querySelector('.education-period')?.textContent || ''
        };
    }
    
    // 자격증 정보 수집
    const certCards = document.querySelectorAll('.cert-card');
    certCards.forEach(card => {
        resumeData.certifications.push({
            name: card.querySelector('.cert-name')?.textContent || '',
            issuer: card.querySelector('.cert-issuer')?.textContent || '',
            date: card.querySelector('.cert-date')?.textContent || ''
        });
    });
    
    return resumeData;
}

// 페이지 로드 시 저장된 데이터 복원
function loadSavedData() {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
        const resumeData = JSON.parse(savedData);
        const editables = document.querySelectorAll('.editable');
        
        editables.forEach((element, index) => {
            const savedContent = resumeData[`editable_${index}`];
            if (savedContent) {
                element.innerHTML = savedContent;
            }
        });
    }
}

// 데이터 초기화 함수
function resetData() {
    if (confirm('모든 변경사항을 초기화하시겠습니까?')) {
        localStorage.removeItem('resumeData');
        location.reload();
    }
}

// 이력서 서비스 초기화
function initializeResumeService() {
    // HTML에 이미 있는 데이터를 유지하되, localStorage에 저장된 데이터가 있으면 사용
    const savedData = localStorage.getItem('resumeData');
    
    if (savedData) {
        try {
            const resumeData = JSON.parse(savedData);
            // 저장된 데이터가 있으면 복원하지만, HTML의 기본값과 병합
            console.log('저장된 이력서 데이터를 확인했습니다.');
        } catch (error) {
            console.error('저장된 데이터 파싱 오류:', error);
            // 파싱 오류 시 localStorage 초기화만 하고 HTML 내용은 유지
            const currentData = collectAllData();
            localStorage.setItem('resumeData', JSON.stringify(currentData));
        }
    } else {
        // localStorage가 비어있으면 현재 HTML 데이터를 수집하여 저장
        const currentData = collectAllData();
        currentData.version = "1.0";
        currentData.lastModified = new Date().toISOString();
        localStorage.setItem('resumeData', JSON.stringify(currentData));
    }
    
    // 3. 자동 저장 기능 활성화
    enableAutoSave();
    
    // 4. 데이터 관리 UI 초기화 (이제 설정 버튼으로 대체됨)
    // initializeDataManagement();
}

// 기본 템플릿 로드
function loadDefaultTemplate() {
    // index.html의 기본 데이터를 사용
    const defaultData = {
        version: "1.0",
        lastModified: new Date().toISOString(),
        personalInfo: {
            name: "박정호",
            title: "백엔드 엔지니어",
            years: "7년차 개발자",
            email: "pjhsk00@naver.com",
            location: "판교, 대한민국",
            jobType: "풀스택 개발 가능",
            availability: "즉시 근무 가능",
            summary: "Java/Spring Boot 기반 엔터프라이즈 시스템 개발자로서 디케이테크인에서 SM엔터테인먼트, 카카오모빌리티 등 프로젝트를 성공적으로 수행했습니다. 성능 최적화 전문성을 바탕으로 검색 로직 리팩토링을 통해 <strong class=\"text-red-600\">20초→0.1초(99.5% 단축)</strong> 등 획기적인 성능 개선을 달성했습니다. N+1 문제 해결, 쿼리 최적화, Kubernetes 인프라 구축 등 다양한 기술 스택을 활용하여 시스템 안정성과 사용자 경험을 지속적으로 개선하고 있습니다."
        },
        techStacks: {
            backend: ["Java", "Spring Boot", "JPA", "QueryDSL"],
            database: ["MySQL", "Oracle DB", "Redis", "Redisson"],
            devops: ["Kubernetes", "Docker", "Jenkins", "Git", "Vue.js"],
            ai: ["Claude", "Gemini API", "Prompt Engineering", "AI Code Review"]
        },
        keyMetrics: [
            { title: "발주 검색 로직", value: "99.5%↓", detail: "20s → 0.1s" },
            { title: "프로젝트 현황 계산", value: "93.7%↓", detail: "16s → 1s" },
            { title: "프로젝트 조회", value: "96.7%↓", detail: "30s → 1s" },
            { title: "GetMoim Latency", value: "80%↓", detail: "200ms → 40ms" },
            { title: "AI 코드 생산성", value: "3.2x↑", detail: "100% → 320%" },
            { title: "SAP 연동 리소스", value: "50%↓", detail: "100% → 50%" }
        ],
        experience: window.companyExperienceData || [],
        projects: [
            {
                title: "겟모임(GetMoim) - 그룹 여행 통합 관리 플랫폼",
                period: "2025.05 - 진행중 (Phase 3 94%)",
                description: "Spring Boot + JPA 기반 서비스 개발 특히 <strong>바이브코딩(AI Pair-Programming)</strong>을 적극 활용하여 <br/>코드 생산성을 3.2배 향상시키고, 2-Level Caching으로 P95 latency 80% 개선<br>AI OCR 및 일정 생성 기능 추가",
                tech: ["Spring Boot", "PostgreSQL", "Redis", "AI (Gemini API)"],
                link: "https://getmoim.com"
            },
            {
                title: "점심 메뉴 추천 크롬 확장 프로그램",
                period: "2024",
                description: "팀 내 점심 메뉴 선택의 어려움을 해결하기 위한 크롬 확장 프로그램 개발<br/>사용자의 선호도를 분석하여 개인화된 메뉴 추천을 제공하며, 팀원들의 점심 시간 효율성 향상에 기여",
                tech: ["JavaScript", "Chrome Extension API", "HTML/CSS"],
                link: "https://chromewebstore.google.com/detail/%EC%A0%90%EB%A9%94%EC%B6%94-%EC%A0%90%EC%8B%AC-%EB%A9%94%EB%89%B4-%EC%B6%94%EC%B2%9C/jbonmoolakgdfiblablgdhkhjmfchjpi"
            },
            {
                title: "Redis 활용 실시간 채팅 서비스",
                period: "2023",
                description: "Redis Pub/Sub를 활용한 실시간 채팅 서비스 개발 WebSocket을 통한 실시간 통신 구현<br/>채널별 메시지 관리 기능을 개발하여 실시간 통신 기술에 대한 이해도 향상",
                tech: ["Spring Boot", "Redis", "WebSocket", "JavaScript"],
                link: ""
            },
            {
                title: "개인 포트폴리오 및 블로그 플랫폼",
                period: "2022 - 현재",
                description: "JPA, Vue.js을 활용하여 사용자 인증, 게시판, 조회수 기능 등을 포함한 웹 개발<br>Oracle Cloud 기반으로 인프라를 구축하고 배포하여 클라우드 환경 운영 경험 확보",
                tech: ["Spring Boot", "JPA", "Vue.js", "Oracle Cloud"],
                link: ""
            },
            {
                title: "사내 메신저 모니터링 시스템",
                period: "2021",
                description: "사내 유지보수 업무 진행 시 업무 등록 모니터링 편의성을 위한 시스템 개발<br>메신저 업무 관련 팝업 발생 시 해당 팝업 이미지를 저장하여 텔레그램으로 발송하는 프로그램 구현",
                tech: ["C#", "OpenCV", "Telegram Bot API"],
                link: ""
            },
            {
                title: "버스킹 플랫폼 인디팟",
                period: "2018",
                description: "Spring 기반 버스킹 공연 알림 플랫폼 개발 Google Maps API를 활용한 위치 기반 서비스<br/>소셜 로그인(Google, Kakao) 기능을 구현하여 사용자 편의성 향상",
                tech: ["Spring Framework", "MySQL", "Google Maps API", "OAuth"],
                link: ""
            }
        ],
        education: {
            school: "부경대학교",
            major: "IT융합응용공학과 학사",
            period: "2011.03 - 2017.02"
        },
        certifications: [
            {
                name: "정보처리기사",
                issuer: "한국산업인력공단",
                date: "2016.11"
            }
        ]
    };
    
    // 현재 HTML에 있는 내용은 유지하되, localStorage만 초기화
    localStorage.setItem('resumeData', JSON.stringify(defaultData));
    showNotification('기본 템플릿으로 초기화되었습니다.');
}

// 자동 저장 기능
function enableAutoSave() {
    let saveTimeout;
    
    // 모든 contenteditable 요소에 input 이벤트 리스너 추가
    document.addEventListener('input', function(e) {
        if (e.target.hasAttribute('contenteditable') || e.target.classList.contains('editable')) {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                if (isEditMode) {
                    const data = collectAllData();
                    localStorage.setItem('resumeData', JSON.stringify(data));
                    console.log('자동 저장됨');
                }
            }, 1000); // 1초 후 자동 저장
        }
    });
}

// 설정 메뉴 토글
function toggleSettingsMenu() {
    // GitHub Pages에서 관리자 모드가 아닌 경우 설정 메뉴 차단
    const isGitHubPages = window.location.hostname.includes('github.io');
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
    const isAdminMode = window.adminAuth ? window.adminAuth.isAuthenticated() : false;
    
    if (isGitHubPages && !isLocalDev && !isAdminMode) {
        alert('설정 권한이 없습니다.');
        return;
    }
    
    const settingsMenu = document.getElementById('settingsMenu');
    if (settingsMenu.style.visibility === 'visible') {
        settingsMenu.style.opacity = '0';
        settingsMenu.style.visibility = 'hidden';
        settingsMenu.style.transform = 'translateY(10px)';
    } else {
        settingsMenu.style.opacity = '1';
        settingsMenu.style.visibility = 'visible';
        settingsMenu.style.transform = 'translateY(0)';
    }
}

// 설정 메뉴 외부 클릭 시 닫기
document.addEventListener('click', function(event) {
    const settingsButton = document.getElementById('settingsButton');
    const settingsMenu = document.getElementById('settingsMenu');
    
    if (!settingsButton.contains(event.target) && !settingsMenu.contains(event.target)) {
        settingsMenu.style.opacity = '0';
        settingsMenu.style.visibility = 'hidden';
        settingsMenu.style.transform = 'translateY(10px)';
    }
});

// 데이터 관리 UI 초기화
function initializeDataManagement() {
    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .data-management-container {
            position: fixed;
            bottom: 2rem;
            left: 2rem;
            z-index: 1000;
        }
        
        .data-management-trigger {
            width: 48px;
            height: 48px;
            background: rgba(59, 130, 246, 0.9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .data-management-trigger:hover {
            background: rgba(37, 99, 235, 1);
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }
        
        .data-management-menu {
            position: absolute;
            bottom: 100%;
            left: 0;
            margin-bottom: 0.5rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 0.5rem;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all 0.3s ease;
            min-width: 150px;
        }
        
        .data-management-container:hover .data-management-menu {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .data-menu-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: none;
            background: none;
            cursor: pointer;
            font-size: 0.875rem;
            color: #374151;
            border-radius: 4px;
            transition: all 0.2s ease;
            text-align: left;
        }
        
        .data-menu-button:hover {
            background: #f3f4f6;
            color: #111827;
        }
        
        .data-menu-button i {
            width: 16px;
            text-align: center;
        }
    `;
    document.head.appendChild(style);
    
    // 데이터 관리 컨테이너 생성
    const dataManagementDiv = document.createElement('div');
    dataManagementDiv.className = 'data-management-container';
    dataManagementDiv.innerHTML = `
        <div class="data-management-trigger">
            <i class="fas fa-cog text-white" style="font-size: 20px;"></i>
        </div>
        <div class="data-management-menu">
            <button onclick="exportData()" class="data-menu-button">
                <i class="fas fa-download text-gray-600"></i>
                <span>JSON 내보내기</span>
            </button>
            <button onclick="document.getElementById('importFile').click()" class="data-menu-button">
                <i class="fas fa-upload text-gray-600"></i>
                <span>JSON 불러오기</span>
            </button>
            <button onclick="setupGitHubSync()" class="data-menu-button">
                <i class="fab fa-github text-blue-600"></i>
                <span>GitHub 연동</span>
            </button>
            <div style="border-top: 1px solid #e5e7eb; margin: 0.25rem 0;"></div>
            <button onclick="resetToTemplate()" class="data-menu-button">
                <i class="fas fa-redo text-red-600"></i>
                <span>초기화</span>
            </button>
            <input type="file" id="importFile" accept=".json" style="display: none;" onchange="importData(event)">
        </div>
    `;
    document.body.appendChild(dataManagementDiv);
}

// 데이터 내보내기
function exportData() {
    const data = collectAllData();
    data.version = "1.0";
    data.lastModified = new Date().toISOString();
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    
    const today = new Date().toISOString().split('T')[0];
    const name = data.personalInfo?.name || '이력서';
    link.download = `${name}_이력서_${today}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('이력서 데이터를 내보냈습니다.');
}

// 데이터 불러오기
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            restoreData(data);
            localStorage.setItem('resumeData', JSON.stringify(data));
            showNotification('이력서 데이터를 성공적으로 불러왔습니다.');
        } catch (error) {
            console.error('JSON 파싱 오류:', error);
            showNotification('파일 형식이 올바르지 않습니다.');
        }
    };
    reader.readAsText(file);
    
    // 파일 입력 초기화
    event.target.value = '';
}

// 템플릿으로 초기화
function resetToTemplate() {
    if (confirm('모든 데이터를 초기화하고 기본 템플릿으로 되돌리시겠습니까?\n현재 작성한 내용은 모두 삭제됩니다.')) {
        localStorage.removeItem('resumeData');
        loadDefaultTemplate();
    }
}

// GitHub API 설정
let githubToken = localStorage.getItem('githubToken');
let githubRepo = localStorage.getItem('githubRepo');
let githubPath = localStorage.getItem('githubPath') || 'resume_data.json';

// GitHub 연동 설정
function setupGitHubSync() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 class="text-lg font-bold mb-4">GitHub 연동 설정</h3>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1">Personal Access Token</label>
                <input type="password" id="githubTokenInput" class="w-full px-3 py-2 border rounded" placeholder="ghp_xxxxxxxxxxxx" value="${githubToken || ''}">
                <p class="text-xs text-gray-500 mt-1">Settings > Developer settings > Personal access tokens에서 생성</p>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1">Repository (owner/repo)</label>
                <input type="text" id="githubRepoInput" class="w-full px-3 py-2 border rounded" placeholder="username/resume" value="${githubRepo || ''}">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1">파일 경로</label>
                <input type="text" id="githubPathInput" class="w-full px-3 py-2 border rounded" placeholder="resume_data.json" value="${githubPath}">
            </div>
            <div class="flex gap-2 justify-end">
                <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">취소</button>
                <button onclick="saveGitHubSettings()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">저장</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// GitHub 설정 저장
function saveGitHubSettings() {
    githubToken = document.getElementById('githubTokenInput').value;
    githubRepo = document.getElementById('githubRepoInput').value;
    githubPath = document.getElementById('githubPathInput').value;
    
    localStorage.setItem('githubToken', githubToken);
    localStorage.setItem('githubRepo', githubRepo);
    localStorage.setItem('githubPath', githubPath);
    
    document.querySelector('.fixed').remove();
    showNotification('GitHub 연동 설정이 저장되었습니다.');
    
    // 설정 후 자동으로 GitHub에서 데이터 로드 시도
    loadFromGitHub();
}

// GitHub에서 데이터 로드
async function loadFromGitHub() {
    if (!githubToken || !githubRepo) return;
    
    try {
        const [owner, repo] = githubRepo.split('/');
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${githubPath}`, {
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const content = JSON.parse(atob(data.content));
            restoreData(content);
            localStorage.setItem('resumeData', JSON.stringify(content));
            localStorage.setItem('githubSha', data.sha);
            showNotification('GitHub에서 데이터를 불러왔습니다.');
        }
    } catch (error) {
        console.error('GitHub 로드 실패:', error);
    }
}

// GitHub에 데이터 저장
async function saveToGitHub() {
    if (!githubToken || !githubRepo) {
        showNotification('GitHub 연동 설정이 필요합니다.');
        return;
    }
    
    try {
        const [owner, repo] = githubRepo.split('/');
        const data = collectAllData();
        data.version = "1.0";
        data.lastModified = new Date().toISOString();
        
        const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
        const sha = localStorage.getItem('githubSha');
        
        const body = {
            message: `Update resume data - ${new Date().toLocaleString()}`,
            content: content,
            sha: sha
        };
        
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${githubPath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('githubSha', result.content.sha);
            showNotification('GitHub에 저장되었습니다!');
        } else {
            throw new Error('GitHub 저장 실패');
        }
    } catch (error) {
        console.error('GitHub 저장 실패:', error);
        showNotification('GitHub 저장 실패. 설정을 확인해주세요.');
    }
}

// saveChanges 함수 수정
function saveChanges() {
    const resumeData = collectAllData();
    resumeData.version = "1.0";
    resumeData.lastModified = new Date().toISOString();
    
    // localStorage에 저장
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    
    // GitHub 연동이 설정되어 있으면 GitHub에도 저장
    if (githubToken && githubRepo) {
        saveToGitHub();
    }
    
    showNotification('변경사항이 저장되었습니다!');
}

// 데이터 관리 시스템 초기화
initializeResumeService();

// GitHub 연동이 설정되어 있으면 자동으로 로드
if (githubToken && githubRepo) {
    loadFromGitHub();
}

// Restore data from JSON
function restoreData(data) {
    // Restore personal info
    if (data.personalInfo) {
        // 헤더 정보 복원
        const nameEl = document.querySelector('h1.editable');
        if (nameEl) nameEl.textContent = data.personalInfo.name || nameEl.textContent;
        
        const titleEl = document.querySelector('header p.editable');
        if (titleEl) titleEl.textContent = data.personalInfo.title || titleEl.textContent;
        
        const yearsEl = document.querySelector('.text-right .editable');
        if (yearsEl) yearsEl.textContent = data.personalInfo.years || yearsEl.textContent;
        
        const emailEl = document.querySelector('.fa-envelope').parentElement.querySelector('.editable');
        if (emailEl) emailEl.textContent = data.personalInfo.email || emailEl.textContent;
        
        const locationEl = document.querySelector('.fa-map-marker-alt').parentElement.querySelector('.editable');
        if (locationEl) locationEl.textContent = data.personalInfo.location || locationEl.textContent;
        
        const jobTypeEl = document.querySelector('.fa-code').parentElement.querySelector('.editable');
        if (jobTypeEl) jobTypeEl.textContent = data.personalInfo.jobType || jobTypeEl.textContent;
        
        const availabilityEl = document.querySelector('.fa-calendar-check').parentElement.querySelector('.editable');
        if (availabilityEl) availabilityEl.textContent = data.personalInfo.availability || availabilityEl.textContent;
        
        // 개요 섹션 복원
        const summaryElement = document.querySelector('#summary .editable');
        if (summaryElement && data.personalInfo.summary) {
            summaryElement.innerHTML = data.personalInfo.summary;
        }
    }

    // Restore tech stacks
    if (data.techStacks) {
        // 카테고리별 기술 스택 복원
        Object.entries(data.techStacks).forEach(([category, techs]) => {
            const container = document.querySelector(`.tech-stack-container[data-category="${category}"]`);
            if (container && Array.isArray(techs)) {
                const addBtn = container.querySelector('.add-tech-btn');
                // 기존 기술 제거 (add 버튼 제외)
                container.querySelectorAll('.editable-tech').forEach(tech => tech.remove());
                
                // 저장된 기술 추가
                techs.forEach(techName => {
                    const tech = document.createElement('span');
                    tech.className = 'text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded editable-tech';
                    tech.textContent = techName;
                    container.insertBefore(tech, addBtn);
                });
            }
        });
    }

    // Restore projects
    if (data.projects && Array.isArray(data.projects)) {
        const projectCards = document.querySelectorAll('#projects .card');
        data.projects.forEach((project, index) => {
            if (projectCards[index]) {
                const card = projectCards[index];
                const editables = card.querySelectorAll('.editable');
                
                if (editables[0]) editables[0].textContent = project.title || editables[0].textContent;
                if (editables[1]) editables[1].textContent = project.period || editables[1].textContent;
                if (editables[2]) editables[2].innerHTML = project.description || editables[2].innerHTML;
                
                // 기술 태그 업데이트
                if (project.tech && Array.isArray(project.tech)) {
                    const techContainer = card.querySelector('.flex.flex-wrap.gap-1\\.5.mb-2');
                    if (techContainer) {
                        // 기존 기술 태그 제거
                        techContainer.querySelectorAll('span.text-xs.px-1\\.5').forEach(span => span.remove());
                        
                        // 새 기술 태그 추가
                        project.tech.forEach(tech => {
                            const span = document.createElement('span');
                            span.className = 'text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded';
                            span.style.fontSize = '11px';
                            span.textContent = tech;
                            techContainer.appendChild(span);
                        });
                    }
                }
                
                // 링크 업데이트
                if (project.link) {
                    const link = card.querySelector('a');
                    if (link) link.href = project.link;
                }
            }
        });
    }

    // Restore key metrics
    if (data.keyMetrics && Array.isArray(data.keyMetrics)) {
        const metricCards = document.querySelectorAll('#impact .bg-white.border');
        data.keyMetrics.forEach((metric, index) => {
            if (metricCards[index]) {
                const card = metricCards[index];
                const titleEl = card.querySelector('h4');
                const valueEl = card.querySelector('p.text-2xl');
                const detailEl = card.querySelector('p.text-xs');
                
                if (titleEl) titleEl.textContent = metric.title || titleEl.textContent;
                if (valueEl) valueEl.textContent = metric.value || valueEl.textContent;
                if (detailEl) detailEl.textContent = metric.detail || detailEl.textContent;
            }
        });
    }

    // Restore experience data
    if (data.experience && data.experience.length > 0) {
        experienceData = data.experience;
        // Rebuild timeline if needed
        const timelineContainer = document.getElementById('timeline-container');
        if (timelineContainer) {
            timelineContainer.innerHTML = '';
            experienceData.forEach(exp => {
                const item = document.createElement('div');
                item.className = 'timeline-item-container mb-8 cursor-pointer p-4 border border-transparent rounded-xl hover:bg-gray-50 transition-all duration-300';
                item.dataset.id = exp.id;
                item.innerHTML = `
                    <div class="timeline-item">
                        <h4 class="font-bold text-lg text-gray-800">${exp.title}</h4>
                        <p class="text-sm text-gray-500">${exp.company} | ${exp.period}</p>
                    </div>
                `;
                item.addEventListener('click', () => {
                    if (typeof displayExperienceDetails === 'function') {
                        displayExperienceDetails(exp.id);
                    }
                });
                timelineContainer.appendChild(item);
            });
            
            // Display first item by default
            if (experienceData.length > 0 && typeof displayExperienceDetails === 'function') {
                displayExperienceDetails(experienceData[0].id);
            }
        }
    }

    // Restore education
    if (data.education) {
        const educationSection = document.querySelector('#education-cert');
        if (educationSection) {
            const schoolEl = educationSection.querySelector('.education-school');
            const majorEl = educationSection.querySelector('.education-major');
            const periodEl = educationSection.querySelector('.education-period');
            
            if (schoolEl) schoolEl.textContent = data.education.school || schoolEl.textContent;
            if (majorEl) majorEl.textContent = data.education.major || majorEl.textContent;
            if (periodEl) periodEl.textContent = data.education.period || periodEl.textContent;
        }
    }

    // Restore certifications
    if (data.certifications && data.certifications.length > 0) {
        const certContainer = document.querySelector('.cert-container');
        if (certContainer) {
            certContainer.innerHTML = '';
            data.certifications.forEach(cert => {
                const certCard = document.createElement('div');
                certCard.className = 'cert-card card p-4';
                certCard.innerHTML = `
                    <h4 class="cert-name font-bold text-lg editable">${cert.name}</h4>
                    <p class="cert-issuer text-sm text-gray-600 editable">${cert.issuer}</p>
                    <p class="cert-date text-sm text-gray-500 editable">${cert.date}</p>
                `;
                certContainer.appendChild(certCard);
            });
        }
    }

    // Store in localStorage as well
    localStorage.setItem('resumeData', JSON.stringify(data));
}

// 기술 스택 추가 함수
function addTech() {
    const newTech = prompt('추가할 기술을 입력하세요:');
    if (newTech && newTech.trim()) {
        const techContainer = document.querySelector('.tech-container');
        const addButton = techContainer.querySelector('.tech-add');
        
        const techCard = document.createElement('div');
        techCard.className = 'tech-card tech-item';
        techCard.innerHTML = `
            <span contenteditable="true" spellcheck="false">${newTech.trim()}</span>
            <button class="tech-remove" onclick="removeTech(this)">×</button>
        `;
        
        techContainer.insertBefore(techCard, addButton);
        
        // 즉시 저장
        const data = collectAllData();
        localStorage.setItem('resumeData', JSON.stringify(data));
    }
}

// 기술 스택 삭제 함수
function removeTech(button) {
    if (confirm('이 기술을 삭제하시겠습니까?')) {
        button.parentElement.remove();
        
        // 즉시 저장
        const data = collectAllData();
        localStorage.setItem('resumeData', JSON.stringify(data));
    }
}

// 편집 모드에서 기술 스택 클릭 이벤트
document.addEventListener('click', function(e) {
    if (isEditMode && e.target.classList.contains('tech-remove')) {
        e.stopPropagation();
    }
});

// Ctrl/Cmd + E로 편집 모드 토글
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        toggleEditMode();
    }
});

// 기술 스택 편집 함수들
function handleTechEdit(e) {
    if (!isEditMode) return;
    
    const tech = e.target;
    const originalText = tech.textContent;
    
    tech.contentEditable = true;
    tech.classList.add('editing');
    tech.focus();
    
    // 텍스트 전체 선택
    const range = document.createRange();
    range.selectNodeContents(tech);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    
    const finishEdit = () => {
        tech.contentEditable = false;
        tech.classList.remove('editing');
        if (tech.textContent.trim() === '') {
            tech.textContent = originalText;
        }
        saveTechStack();
    };
    
    tech.addEventListener('blur', finishEdit, { once: true });
    tech.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            tech.blur();
        }
    });
}

function handleTechDelete(e) {
    if (!isEditMode) return;
    e.preventDefault();
    
    if (confirm('이 기술을 삭제하시겠습니까?')) {
        e.target.remove();
        saveTechStack();
    }
}

function addTech(category) {
    const container = document.querySelector(`.tech-stack-container[data-category="${category}"]`);
    const addBtn = container.querySelector('.add-tech-btn');
    
    const newTech = document.createElement('span');
    newTech.className = 'text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded editable-tech';
    newTech.textContent = '새 기술';
    
    container.insertBefore(newTech, addBtn);
    
    // 편집 모드로 전환
    newTech.addEventListener('click', handleTechEdit);
    newTech.addEventListener('contextmenu', handleTechDelete);
    
    // 즉시 편집 시작
    handleTechEdit({ target: newTech });
}

// 기술 스택 저장
function saveTechStack() {
    const techData = {};
    document.querySelectorAll('.tech-stack-container').forEach(container => {
        const category = container.dataset.category;
        const techs = Array.from(container.querySelectorAll('.editable-tech')).map(tech => tech.textContent);
        techData[category] = techs;
    });
    
    const savedData = JSON.parse(localStorage.getItem('resumeData') || '{}');
    savedData.techStack = techData;
    localStorage.setItem('resumeData', JSON.stringify(savedData));
}

// 기술 스택 복원
function loadTechStack() {
    const savedData = JSON.parse(localStorage.getItem('resumeData') || '{}');
    if (savedData.techStack) {
        Object.entries(savedData.techStack).forEach(([category, techs]) => {
            const container = document.querySelector(`.tech-stack-container[data-category="${category}"]`);
            if (container) {
                const addBtn = container.querySelector('.add-tech-btn');
                // 기존 기술 제거
                container.querySelectorAll('.editable-tech').forEach(tech => tech.remove());
                
                // 저장된 기술 추가
                techs.forEach(techName => {
                    const tech = document.createElement('span');
                    tech.className = 'text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded editable-tech';
                    tech.textContent = techName;
                    container.insertBefore(tech, addBtn);
                });
            }
        });
    }
}

// JSON 내보내기
function exportData() {
    const resumeData = collectAllData();
    
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('이력서 데이터가 JSON 파일로 내보내졌습니다.');
}

// JSON 불러오기를 위한 파일 input 추가
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.id = 'importFile';
fileInput.accept = '.json';
fileInput.style.display = 'none';
fileInput.addEventListener('change', handleFileImport);
document.body.appendChild(fileInput);

function handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            restoreData(data);
            showNotification('이력서 데이터를 성공적으로 불러왔습니다.');
        } catch (error) {
            console.error('JSON 파싱 에러:', error);
            showNotification('올바른 JSON 파일이 아닙니다.', 'error');
        }
    };
    reader.readAsText(file);
    
    // 파일 input 초기화
    e.target.value = '';
}

// 템플릿 데이터 로드
function loadTemplateData() {
    if (confirm('현재 작성한 내용이 모두 초기화됩니다. 계속하시겠습니까?')) {
        loadDefaultTemplate();
        showNotification('템플릿 데이터로 초기화되었습니다.');
    }
}

// 캐시 비우기
function clearCache() {
    if (confirm('브라우저 캐시를 비우고 페이지를 새로고침합니다. 계속하시겠습니까?')) {
        // 모든 캐시 데이터 삭제
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
        
        // localStorage와 sessionStorage 클리어 (선택사항)
        // localStorage.clear();
        // sessionStorage.clear();
        
        // 캐시를 무시하고 강제 새로고침
        showNotification('캐시를 비우고 새로고침합니다...');
        
        setTimeout(() => {
            // 캐시 무효화를 위해 타임스탬프 파라미터 추가
            const timestamp = new Date().getTime();
            const url = window.location.href.split('?')[0] + '?v=' + timestamp;
            window.location.href = url;
        }, 500);
    }
}

// 자격증 추가 기능
function addCertification() {
    const certContainer = document.querySelector('.add-cert-btn').parentElement;
    const newCert = document.createElement('div');
    newCert.className = 'card p-4 cert-card';
    newCert.innerHTML = `
        <div class="flex items-start justify-between">
            <div>
                <h4 class="text-sm font-semibold text-gray-900 editable cert-name">자격증명</h4>
                <p class="text-xs text-gray-600 mt-1 editable cert-issuer">발급기관</p>
            </div>
            <p class="text-xs text-gray-500 editable cert-date">YYYY.MM</p>
        </div>
        <button class="cert-remove mt-2 text-xs text-red-600 hover:text-red-800" onclick="removeCertification(this)" style="display: none;">
            <i class="fas fa-trash"></i> 삭제
        </button>
    `;
    
    // 추가 버튼 바로 위에 삽입
    certContainer.insertBefore(newCert, document.querySelector('.add-cert-btn'));
    
    // 편집 가능하도록 설정
    newCert.querySelectorAll('.editable').forEach(element => {
        element.setAttribute('contenteditable', 'true');
        element.setAttribute('spellcheck', 'false');
        element.addEventListener('focus', handleFocus);
        element.addEventListener('blur', handleBlur);
        element.addEventListener('paste', handlePaste);
    });
    
    // 첫 번째 요소에 포커스
    newCert.querySelector('.cert-name').focus();
}

// 자격증 삭제 기능
function removeCertification(button) {
    if (confirm('이 자격증을 삭제하시겠습니까?')) {
        button.closest('.cert-card').remove();
        saveChanges();
    }
}

// 편집 모드 토글 함수 수정
const originalToggleEditMode = toggleEditMode;
toggleEditMode = function() {
    originalToggleEditMode();
    
    // 자격증 추가 버튼 표시/숨김
    const addCertBtn = document.querySelector('.add-cert-btn');
    const certRemoveBtns = document.querySelectorAll('.cert-remove');
    
    if (isEditMode) {
        if (addCertBtn) addCertBtn.style.display = 'block';
        certRemoveBtns.forEach(btn => btn.style.display = 'inline-block');
    } else {
        if (addCertBtn) addCertBtn.style.display = 'none';
        certRemoveBtns.forEach(btn => btn.style.display = 'none');
    }
};

