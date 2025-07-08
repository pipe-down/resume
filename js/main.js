document.addEventListener('DOMContentLoaded', () => {
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
            description: '카카오 계열사 IT 서비스 전문 기업에서 다양한 대규모 프로젝트의 백엔드 개발을 담당하고 있습니다.',
            projects: [
                { id: 'sm_gw', period: '2025.01 - 2025.06', title: 'SM엔터테인먼트 그룹웨어 SAP 고도화', description: 'SM 엔터테인먼트 그룹웨어 전자결재 시스템과 SAP 연동 고도화 프로젝트를 주도하여 공통 모듈 개발 및 연동 프로세스 개선을 담당했습니다.', achievements: ['CO, SA, MM 모듈 SAP RFC 연동 개발을 주도하고 비동기 처리 적용으로 시스템 성능 및 안정성 확보.', 'Jxls 활용 공통 엑셀 다운로드 유틸 개발 및 리팩토링으로 코드 재사용성 향상 및 유지보수 효율 개선.', 'SAP 연동 공통 모듈 개발로 연동 개발 리소스 50% 이상 단축 및 개발 생산성 증대.', 'LLM을 활용한 테스트 코드 작성 방안 연구 및 공유로 팀의 기술적 성장 도모.'], tech: ['Java', 'Spring Boot', 'JPA', 'SAP RFC', 'MySQL', 'Kubernetes', 'Vue.js'] },
                { id: 'dkt_pms_ops', period: '2025.01 - 2025.04', title: 'DKT PMS 2.7 및 워크솔루션 운영', description: 'PMS 2.7 시스템의 안정화 및 워크솔루션 운영을 담당하며 성능 최적화와 기능 고도화를 수행했습니다.', achievements: ['프로젝트 히스토리 기능 개발로 변경 이력 관리 및 추적성 강화, 데이터 검증 편의성 확대.', '프로젝트 현황 조회 성능을 20초에서 0.3초로 개선하여 사용자 대기 시간 단축.', 'N+1 문제 해결 및 매핑 로직 개선으로 문서 조회 성능 최적화.', '체계적인 데이터 마이그레이션 계획 수립 및 실행으로 안정적인 서비스 오픈 기여.', 'bulk insert 적용으로 대량 데이터 처리 성능 및 안정성 향상.'], tech: ['Java', 'Spring Boot', 'JPA', 'QueryDSL', 'MySQL', 'Kubernetes'] },
                { id: 'kakao_am_sso', period: '2025.04', title: '카카오모빌리티 자산관리시스템 SSO 적용', description: '카카오모빌리티 자산관리시스템에 SSO 로그인을 도입하여 보안 및 사용자 편의성을 강화했습니다.', achievements: ['BE/FE 로그인 로직 수정 및 SSO 필터 적용으로 안정적인 통합 인증 시스템 구축.', '개발/CBT/운영 환경 배포 주도 및 리다이렉트 이슈 신속 해결로 서비스 안정성 확보.', '로그 추적을 통한 예외 케이스 처리 및 고객사 테스트 원활 진행.'], tech: ['Java', 'Spring Boot', 'SSO', 'OAuth 2.0', 'Vue.js'] },
                { id: 'dkt_pms', period: '2024.06 - 2024.12', title: 'DKT 프로젝트 매니징 시스템(PMS) 2.7 구축', description: '사내 프로젝트 관리 시스템(PMS) 2.7 버전 구축을 리드하며 핵심 기능 개발 및 성능 최적화를 담당했습니다.', achievements: ['발주 검색 로직 리팩토링으로 응답 시간을 20초에서 0.1초로 99.5% 단축하여 사용자 경험 획기적 개선.', '병렬 처리 도입으로 프로젝트 현황 계산 시간을 16초에서 1초로 93.7% 감소시켜 생산성 극대화.', 'N+1 문제 해결 및 쿼리 최적화로 프로젝트 조회 성능 30초에서 1초로 96.7% 개선.', '프로젝트 히스토리 기능 개발 및 공통 모듈화를 통해 시스템 유지보수성 및 확장성 확보.', '일정 단축(50MD → 43MD) 달성 및 FT 작업 동시 진행으로 리소스 효율성 증대.'], tech: ['Java', 'Spring Boot', 'JPA', 'QueryDSL', 'MySQL', 'Kubernetes', 'Vue.js'] },
                { id: 'kakao_work_am', period: '2024.08 - 2024.10', title: '카카오워크 1.5 자산관리 시스템 개발', description: '카카오워크 1.5 자산관리 시스템 버전 업그레이드 및 개발/운영 환경 구축을 담당했습니다.', achievements: ['Spring Boot 3.3.3, JDK 17 버전 업그레이드로 시스템 최신성 유지 및 보안 강화.', '개발/테스트/운영 환경 구축 및 D2HUB 배포 환경 셋팅으로 안정적인 서비스 제공.', 'deprecated 코드 수정 및 공통 유효성 검사 로직 리팩토링으로 코드 품질 향상.', 'PC/모바일 환경의 공통 화면 및 메뉴 재정의로 사용자 경험 개선.'], tech: ['Java', 'Spring Boot', 'JPA', 'MySQL', 'Docker', 'D2hub'] },
                { id: 'kakao_am', period: '2023.09 - 2024.05', title: '카카오모빌리티 자산관리시스템 구축', description: '카카오모빌리티 사내 자산관리 시스템을 신규 구축하며 DevOps, DB 마이그레이션 등을 담당했습니다.', achievements: ['Kubernetes 기반 인프라 환경 설계 및 Helm Chart 구성을 통한 배포 자동화 및 운영 효율성 증대.', 'Spring Boot 3.3.3, JDK 17 버전 업그레이드로 시스템 최신성 유지 및 보안 강화.', 'SSO 로그인 도입 및 통합 인증 시스템 구축으로 보안성 및 사용자 편의성 동시 달성.', 'Zebra 프린터 연동 개발을 통해 자산 라벨링 및 관리 프로세스 자동화.', '대용량 수기 관리 데이터를 Temp Table 및 Join Update 방식으로 안정적으로 마이그레이션.'], tech: ['Java', 'Spring Boot', 'JPA', 'MySQL', 'Kubernetes', 'D2hub', 'Vue.js'] },
                { id: 'dkt_resource', period: '2024.01 - 2024.04', title: 'DKT 자원예약 시스템 개선', description: '사내 자원예약 시스템의 권한 체계 개선 및 기능 고도화를 담당했습니다.', achievements: ['부서별 권한 테이블 설계 및 권한 관리 로직 개선으로 관리 편의성 확대.', 'QueryDSL을 활용한 복잡한 검색 조건 처리 및 API 성능 최적화.', '슈퍼 관리자 권한 추가 및 운영자 결재 토글 기능으로 사용자 편의성 향상.', '단위 테스트 작성 및 에러 수정으로 시스템 안정성 강화.'], tech: ['Java', 'Spring Boot', 'JPA', 'QueryDSL', 'MySQL'] },
                { id: 'dkt_friday', period: '2023.04 - 2023.09', title: '프라이데이-하루 시스템 연동', description: '프로젝트 관리 시스템과 근태 관리 시스템 간의 데이터 연동 프로젝트를 수행했습니다.', achievements: ['하루 카테고리 관리 API 및 업무 데이터 동기화 API 개발로 시스템 간 원활한 연동 구현.', '월 10만건 이상 누적 데이터 동기화 처리 방안 설계 및 성능 최적화.', 'N+1 이슈 해결 및 단건 조회 최적화로 API 성능 향상.', '직무 세분화 작업 및 통계 화면 매핑 로직 개선으로 데이터 정확성 향상.'], tech: ['Java', 'Spring Boot', 'JPA', 'MySQL', 'REST API'] },
                { id: 'kakao_cr', period: '2022.05 - 2023.12', title: '카카오 캠퍼스 예약 코어시스템 개발', description: '카카오 신규 사옥의 예약 시스템 코어 개발에 참여하여 대용량 트랜잭션 처리 및 동시성 제어를 담당했습니다.', achievements: ['JdbcTemplate BatchUpdate 적용으로 재고 데이터 생성 성능 획기적 개선.', 'Entity 관계 설계 최적화 및 QueryDSL Projections 활용으로 N+1 문제를 원천적으로 해결.', 'Redisson 분산 락(Distributed Lock) 구현을 통해 예약 채번 프로세스의 동시성 이슈 해결 및 데이터 정합성 확보.', '사용자 테이블 이원화 대응 및 Subselect 활용으로 기존 코드 영향도 최소화.'], tech: ['Java', 'Spring Boot', 'JPA', 'Redisson', 'MySQL', 'GitLab'] },
                { id: 'dkt_systems', period: '2022.07 - 2024.06', title: 'DKT 사내시스템 개발 및 운영', description: '하루, 휴가, IDC캘린더 등 다양한 사내 시스템의 개발 및 운영을 담당했습니다.', achievements: ['휴가 신청 성능 15초에서 1-3초로 개선, 하루 동기화 N+1 문제 해결로 서버 부하 감소.', '월 근무 내역 조회 성능 6초에서 1초로 개선, 인덱스 추가 및 쿼리 최적화 수행.', 'EOL 보안 검수 대응 및 개인정보영향평가 수행으로 시스템 보안성 강화.', '연차 초과 사용 동시성 이슈 해결 및 낙관적 락 적용으로 데이터 정합성 확보.'], tech: ['Java', 'Spring Boot', 'JPA', 'MySQL', 'QueryDSL'] },
            ]
        },
        {
            company: '세정아이앤씨',
            period: '2018.09 - 2021.06',
            position: '주니어 백엔드 개발자',
            description: '그룹사 통합 인사 시스템 및 주얼리 브랜드의 차세대 ERP/POS 시스템 개발과 운영을 담당했습니다.',
            projects: [
                { id: 'sejung_ep', period: '2020.05 - 2021.06', title: 'EP 통합 인사 시스템 개발 및 유지보수', description: '세정그룹 통합 인사, 회계 시스템 개발 및 유지보수를 담당했습니다.', achievements: ['영업지원 업무 관리 시스템 구현으로 POS-EP 연동을 통해 매장과 담당자간 업무 프로세스 간소화.', '계열사 간 퇴직금 이관 관리 시스템 구현으로 관계사 전출시 퇴직금 이관 및 정산 프로세스 자동화.', '당직 근무 자동화 시스템 구현으로 수기 작성하던 당직 근무 관리를 시스템화.', '사내 결재 시스템과 연동된 휴가, 출장, 연장근로 등 근태관리 시스템 구현.', 'IPT 전화기 재고관리 시스템 구현 및 2020년도 연말정산 시스템 작업 수행.', '삼성SDS ACUBE 기반 EP 시스템 관리 및 성과 관리 시스템 개발/유지보수.'], tech: ['Java', 'JSP', 'Oracle DB', 'JavaScript', 'Spring Framework', 'Git'] },
                { id: 'sejung_jewelry', period: '2019.01 - 2019.07', title: '주얼리 브랜드 ERP/POS 시스템 개편', description: '주얼리 브랜드의 ERP, POS 시스템 개편 프로젝트 개발 및 오픈 지원을 담당했습니다.', achievements: ['C# 클라이언트와 Spring Framework 서버 기반의 차세대 시스템 구축에 참여.', '수출업무 단위 화면 개발로 해외 거래 프로세스 효율화.', '고객관리 업무 화면 개발로 CRM 기능 강화.', '레거시 시스템의 문자 인증 기능을 신규 시스템에 안정적으로 마이그레이션.'], tech: ['Java', 'JSP', 'Oracle DB', 'JavaScript', 'Spring Framework', 'C#', 'DevExpress', 'WinForm', '.NET', 'SVN'] },
                { id: 'sejung_erp_pos', period: '2018.09 - 2020.05', title: 'ERP 및 POS 시스템 개발 및 유지보수', description: '그룹사 ERP 및 의류매장 POS 시스템 개발 및 운영을 담당했습니다.', achievements: ['매장간 사이즈이동 프로그램 신규개발로 일평균 800건의 매장간 교환 프로세스를 효율화하여 물량회전 강화에 기여.', 'GC 관련 객체 생성 최소화로 메모리 사용량 개선 (String → StringBuilder/StringBuffer 전환).', 'POS 판매 프로세스 개선을 위해 분산된 프로시저를 통합하여 트랜잭션 처리 속도 향상.', '영업, 채권 관련 ERP 시스템 관리 및 Oracle DB 기반 매장간 제품 로테이션 프로시저 개발.', '성능 향상을 위한 쿼리 튜닝으로 대용량 데이터 처리 속도 개선.'], tech: ['Java', 'JSP', 'Oracle DB', 'JavaScript', 'Spring Framework', 'Delphi', 'Adobe AIR', 'C#', 'DevExpress', 'WinForm', '.NET', 'SVN'] },
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

    const performanceData = {
        labels: [
            '발주 검색', 
            '프로젝트 현황', 
            '월 마감 관리', 
            '휴가 신청',
            '월 근무 내역', 
            '단가 조회'
        ],
        datasets: [
            {
                label: '개선 전',
                data: [20, 20, 20, 15, 30, 20],
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 2,
                borderRadius: 8
            },
            {
                label: '개선 후',
                data: [0.1, 0.3, 1, 2, 3, 0.3],
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2,
                borderRadius: 8
            }
        ]
    };


    // --- CHARTS ---

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
                    display: true,
                    text: '각 프로젝트별 주요 성능 개선 지표',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        bottom: 20
                    }
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
                            improvement = ((value / beforeValue) * 100).toFixed(0) + '%';
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
                            if (context.datasetIndex === 1 && performanceData.datasets[0].data[index] > 0) {
                                let improvement = ((performanceData.datasets[0].data[index] - value) / performanceData.datasets[0].data[index] * 100).toFixed(1);
                                label += ' (-' + improvement + '%)';
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
                        display: true,
                        text: '성능 지표 (로그 스케일)',
                        font: {
                            size: 12
                        }
                    },
                    ticks: {
                        callback: function(value, index) {
                            // 로그 스케일 눈금 표시 개선
                            if (value === 0.1) return '0.1';
                            if (value === 1) return '1';
                            if (value === 10) return '10';
                            if (value === 20) return '20';
                            if (value === 30) return '30';
                            if (value === 40) return '40';
                            if (value === 50) return '50';
                            if (value === 100) return '100';
                            if (value === 200) return '200';
                            if (value === 320) return '320';
                            return value;
                        },
                        font: {
                            size: 11
                        }
                    },
                    min: 0.1,
                    max: 400
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
                            const label = this.getLabelForValue(value);
                            const projectMap = {
                                '발주 검색': 'PMS 2.7',
                                '프로젝트 현황': 'PMS 2.7',
                                '월 마감 관리': 'Knw',
                                '휴가 신청': '휴가시스템',
                                '월 근무 내역': 'Knw',
                                '단가 조회': 'PMS 2.7'
                            };
                            return [label, `(${projectMap[label]})`];
                        }
                    }
                }
            }
        }
    });
    
    // --- INTERACTIVE TIMELINE ---
    const timelineContainer = document.getElementById('timeline-container');
    const detailsPanel = document.getElementById('experience-details');

    function displayExperienceDetails(id) {
        const experience = experienceData.find(exp => exp.id === id);
        if (!experience) return;

        detailsPanel.innerHTML = `
            <h3 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">${experience.title}</h3>
            <p class="text-sm sm:text-md font-semibold text-gray-700 mb-1">${experience.company}</p>
            <p class="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">${experience.period}</p>
            <p class="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">${experience.description}</p>
            <h4 class="font-bold mb-3 sm:mb-4 text-gray-800 text-base sm:text-lg">🎯 주요 성과</h4>
            <ul class="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                ${experience.achievements.map(ach => `<li class="flex items-start text-sm sm:text-base"><span class="text-green-500 mr-2 mt-0.5 sm:mt-1 flex-shrink-0">✓</span><span class="text-gray-700">${ach}</span></li>`).join('')}
            </ul>
            <h4 class="font-bold mb-2 sm:mb-3 text-gray-800 text-sm sm:text-base">🛠️ 사용 기술</h4>
            <div class="flex flex-wrap gap-1 sm:gap-1.5">
                ${experience.tech.map(t => `<span class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">${t}</span>`).join('')}
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

    // Company-based timeline rendering
    companyExperienceData.forEach((company, companyIndex) => {
        const companyContainer = document.createElement('div');
        companyContainer.className = 'company-container mb-4';
        
        // Company header
        const companyHeader = document.createElement('div');
        companyHeader.className = 'company-header mb-2 cursor-pointer p-2 sm:p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-blue-100 transition-all duration-300';
        companyHeader.innerHTML = `
            <div class="flex items-center justify-between gap-2">
                <div class="min-w-0 flex-1">
                    <h3 class="font-bold text-sm sm:text-base text-gray-900">${company.company}</h3>
                    <p class="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">${company.position} • ${company.period}</p>
                </div>
                <i class="fas fa-chevron-down text-gray-400 transition-transform duration-300 text-sm flex-shrink-0" data-company-index="${companyIndex}"></i>
            </div>
        `;
        
        // Project list container
        const projectList = document.createElement('div');
        projectList.className = 'project-list ml-2 sm:ml-4 border-l-2 border-gray-200';
        projectList.style.display = companyIndex === 0 ? 'block' : 'none'; // 첫 번째 회사는 기본적으로 열림
        
        // Add projects
        company.projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'timeline-item-container mb-2 ml-2 sm:ml-4 cursor-pointer p-2 sm:p-3 border-2 border-transparent rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300';
            projectItem.dataset.id = project.id;
            projectItem.innerHTML = `
                <div class="timeline-item relative">
                    <div class="absolute -left-5 sm:-left-7 top-2 sm:top-3 w-2 sm:w-3 h-2 sm:h-3 bg-blue-400 rounded-full"></div>
                    <h4 class="font-semibold text-xs sm:text-sm text-gray-800" style="word-break: keep-all; line-height: 1.3;">${project.title}</h4>
                    <p class="text-xs text-gray-400 mt-0.5 sm:mt-1">${project.period}</p>
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
    
    // Auto-open first company's first project
    if (companyExperienceData.length > 0 && companyExperienceData[0].projects.length > 0) {
        const firstIcon = timelineContainer.querySelector('.company-header i');
        if (firstIcon) firstIcon.style.transform = 'rotate(180deg)';
    }

    // Display the first item by default
    if (experienceData.length > 0) {
        displayExperienceDetails(experienceData[0].id);
    }

    // Create print-only experience sections
    const printContainer = document.querySelector('.experience-print-container');
    if (printContainer) {
        experienceData.forEach(exp => {
            const printSection = document.createElement('div');
            printSection.className = 'experience-print-section';
            printSection.innerHTML = `
                <h3>${exp.title}</h3>
                <p class="company">${exp.company}</p>
                <p class="period">${exp.period}</p>
                <p class="description">${exp.description}</p>
                <h4 style="font-size: 11pt; font-weight: 600; margin-top: 8pt; margin-bottom: 6pt;">주요 성과</h4>
                <ul>
                    ${exp.achievements.map(ach => `<li>${ach}</li>`).join('')}
                </ul>
                <h4 style="font-size: 11pt; font-weight: 600; margin-top: 8pt; margin-bottom: 6pt;">사용 기술</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 4pt;">
                    ${exp.tech.map(t => `<span class="tech-card">${t}</span>`).join('')}
                </div>
            `;
            printContainer.appendChild(printSection);
        });
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
    const isAdminMode = adminAuth.isAuthenticated();
    
    if (isGitHubPages && !isAdminMode) {
        alert('편집 권한이 없습니다.');
        return;
    }
    
    isEditMode = !isEditMode;
    const editButton = document.getElementById('editButton');
    const editButtonText = document.getElementById('editButtonText');
    const editNotification = document.getElementById('editNotification');
    const editables = document.querySelectorAll('.editable');
    const techCards = document.querySelectorAll('.editable-tech');
    const addTechBtns = document.querySelectorAll('.add-tech-btn');
    
    if (isEditMode) {
        // 편집 모드 활성화
        editButton.classList.add('active');
        editButtonText.textContent = '저장하기';
        editNotification.classList.add('active');
        
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
        editButton.classList.remove('active');
        editButtonText.textContent = '편집하기';
        editNotification.classList.remove('active');
        
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
            name: editables[0]?.textContent || '박정호',
            title: editables[1]?.textContent || '백엔드 엔지니어',
            years: editables[2]?.textContent || '6년차 개발자',
            email: editables[3]?.textContent || 'pjhsk00@naver.com',
            location: editables[4]?.textContent || '서울, 대한민국',
            jobType: editables[5]?.textContent || '풀스택 개발 가능',
            availability: editables[6]?.textContent || '즉시 근무 가능',
            summary: editables[7]?.textContent || '경력 요약'
        },
        techStacks: Array.from(document.querySelectorAll('.tech-item span')).map(tech => tech.textContent),
        projects: {},
        keyMetrics: [],
        experience: [],
        education: {},
        certifications: []
    };
    
    // 프로젝트 데이터 수집
    document.querySelectorAll('[data-project]').forEach(projectCard => {
        const projectId = projectCard.dataset.project;
        const techTags = Array.from(projectCard.querySelectorAll('.project-tech-badge')).map(badge => badge.textContent);
        
        resumeData.projects[projectId] = {
            title: projectCard.querySelector('.project-title').textContent,
            period: projectCard.querySelector('.project-period').textContent,
            description: projectCard.querySelector('.project-description').textContent,
            tech: techTags
        };
    });
    
    // 핵심 성과 데이터 수집
    document.querySelectorAll('.metric-card').forEach((card, index) => {
        resumeData.keyMetrics.push({
            value: card.querySelector('.metric-value').textContent,
            label: card.querySelector('.metric-label').textContent
        });
    });
    
    // 경력 데이터 수집 (experienceData 배열 사용)
    resumeData.experience = experienceData;
    
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
    // 1. localStorage에서 데이터 확인
    const savedData = localStorage.getItem('resumeData');
    
    if (savedData) {
        try {
            const resumeData = JSON.parse(savedData);
            restoreData(resumeData);
            console.log('저장된 이력서 데이터를 불러왔습니다.');
        } catch (error) {
            console.error('저장된 데이터 파싱 오류:', error);
            loadDefaultTemplate();
        }
    } else {
        // 2. 저장된 데이터가 없으면 기본 템플릿 로드
        loadDefaultTemplate();
    }
    
    // 3. 자동 저장 기능 활성화
    enableAutoSave();
    
    // 4. 데이터 관리 UI 초기화 (이제 설정 버튼으로 대체됨)
    // initializeDataManagement();
}

// 기본 템플릿 로드
function loadDefaultTemplate() {
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
            summary: "Java/Spring Boot 기반의 엔터프라이즈 시스템을 개발하며, 성능 최적화와 시스템 안정성 확보에 지속적으로 노력해왔습니다.\n\n디케이테크인에서 근무하며 SM엔터테인먼트 그룹웨어 SAP 고도화, 카카오모빌리티 자산관리시스템, DKT PMS 2.7 등 대규모 프로젝트를 성공적으로 수행했습니다. 특히 PMS 2.7 프로젝트에서 발주 검색 로직 리팩토링으로 20초→0.1초(99.5% 단축), 프로젝트 현황 계산 20초→0.3초(98.5% 개선), 단가 조회 성능 개선 등 사용자 경험을 획기적으로 개선하는 성과를 달성했습니다.\n\nN+1 문제 해결, 쿼리 최적화, 분산 락 구현, bulk insert 적용 등의 기술적 도전을 통해 시스템 성능을 향상시켰으며, SAP RFC 연동, SSO 통합 인증, Kubernetes 기반 인프라 구축 등 다양한 기술 스택을 활용한 프로젝트를 성공적으로 수행했습니다. 최근에는 LLM을 활용한 테스트 코드 작성 방안을 연구하고 공유하며 팀의 기술적 성장에도 기여하고 있습니다."
        },
        techStacks: [
            "Java", "Spring Boot", "JPA", "MySQL", "Redis", "Kubernetes", "Docker", "Git", "AWS", "Apache Kafka", "SAP RFC", "Vue.js", "TypeScript"
        ],
        keyMetrics: [
            { value: "7+", label: "Years of Experience" },
            { value: "9+", label: "Major Projects" },
            { value: "99.5%", label: "Performance Improvement" },
            { value: "3.2x", label: "Productivity Gain" }
        ],
        experience: [
        ],
        projects: {
        },
        education: {
            school: "부경대학교",
            major: "IT융합응용공학과",
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
    
    restoreData(defaultData);
    localStorage.setItem('resumeData', JSON.stringify(defaultData));
    showNotification('기본 템플릿을 불러왔습니다. 편집 버튼을 눌러 시작하세요!');
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
    const isAdminMode = adminAuth.isAuthenticated();
    
    if (isGitHubPages && !isAdminMode) {
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
        const editables = Array.from(document.querySelectorAll('.editable'));
        
        if (editables[0]) editables[0].textContent = data.personalInfo.name || '홍길동';
        if (editables[1]) editables[1].textContent = data.personalInfo.title || '백엔드 엔지니어';
        if (editables[2]) editables[2].textContent = data.personalInfo.years || '6년차 개발자';
        if (editables[3]) editables[3].textContent = data.personalInfo.email || 'example@email.com';
        if (editables[4]) editables[4].textContent = data.personalInfo.location || '서울, 대한민국';
        if (editables[5]) editables[5].textContent = data.personalInfo.jobType || '풀스택 개발 가능';
        if (editables[6]) editables[6].textContent = data.personalInfo.availability || '즉시 근무 가능';
        if (editables[7]) {
            const summaryElement = document.querySelector('#summary .editable');
            if (summaryElement && summaryElement.classList.contains('space-y-3')) {
                // 줄바꿈이 있는 summary 처리
                const summaryText = data.personalInfo.summary || '경력 요약';
                const paragraphs = summaryText.split('\n\n');
                summaryElement.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('\n');
            } else if (editables[7]) {
                editables[7].textContent = data.personalInfo.summary || '경력 요약';
            }
        }
    }

    // Restore tech stacks
    if (data.techStacks) {
        const techContainer = document.querySelector('.tech-container');
        if (techContainer) {
            techContainer.innerHTML = '';
            data.techStacks.forEach(tech => {
            const techCard = document.createElement('span');
            techCard.className = 'text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded tech-item';
            techCard.textContent = tech;
            techContainer.appendChild(techCard);
        });
        
            // Add the "add tech" button
            const addButton = document.createElement('button');
            addButton.className = 'tech-add';
            addButton.innerHTML = '<i class="fas fa-plus"></i>';
            addButton.style.display = 'none';
            addButton.onclick = addTech;
            techContainer.appendChild(addButton);
        }
    }

    // Restore projects
    if (data.projects) {
        Object.keys(data.projects).forEach(projectId => {
            const projectData = data.projects[projectId];
            const projectCard = document.querySelector(`[data-project="${projectId}"]`);
            
            if (projectCard) {
                projectCard.querySelector('.project-title').textContent = projectData.title;
                projectCard.querySelector('.project-period').textContent = projectData.period;
                projectCard.querySelector('.project-description').textContent = projectData.description;
                
                if (projectData.tech) {
                    const techContainer = projectCard.querySelector('.project-tech-tags');
                    techContainer.innerHTML = projectData.tech.map(tech => 
                        `<span class="project-tech-badge">${tech}</span>`
                    ).join('');
                }
            }
        });
    }

    // Restore key metrics
    if (data.keyMetrics) {
        const metricCards = document.querySelectorAll('.metric-card');
        data.keyMetrics.forEach((metric, index) => {
            if (metricCards[index]) {
                const valueEl = metricCards[index].querySelector('.metric-value');
                const labelEl = metricCards[index].querySelector('.metric-label');
                if (valueEl) valueEl.textContent = metric.value;
                if (labelEl) labelEl.textContent = metric.label;
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
                item.className = 'timeline-item-container mb-8 cursor-pointer p-4 border-2 border-transparent rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300';
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
            
            if (schoolEl) schoolEl.textContent = data.education.school || '한국대학교';
            if (majorEl) majorEl.textContent = data.education.major || '컴퓨터공학과 학사';
            if (periodEl) periodEl.textContent = data.education.period || '2015.03 - 2019.02';
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

