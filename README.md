# 📄 개인 이력서 - 박정호

Java/Spring Boot 백엔드 개발자의 온라인 이력서입니다. GitHub Pages로 호스팅되며, 실시간 편집과 PDF 내보내기를 지원합니다.

## ✨ 주요 기능

### 📊 인터랙티브 이력서
- **회사별 경력 그룹핑**: 회사별로 프로젝트를 묶어서 표시
- **성과 지표 시각화**: Chart.js를 활용한 성능 개선 지표 차트
- **반응형 디자인**: 모바일/태블릿/데스크톱 모든 환경 지원

### 🛡️ 보안 및 접근 제어
- **공개 모드**: 일반 방문자는 PDF 다운로드만 가능
- **관리자 모드**: 액세스 키 기반 인증으로 편집 기능 활성화 (보안 강화)
- **로컬 개발**: localhost에서는 모든 기능 자동 활성화

### 💾 데이터 관리
- **로컬 스토리지**: 브라우저에 자동 저장
- **JSON 내보내기/불러오기**: 데이터 백업 및 복원
- **GitHub 연동**: 자동 커밋 기능 (선택사항)
- **템플릿 초기화**: 기본 템플릿으로 리셋

### 📄 PDF 내보내기
- **A4 최적화**: 이력서 제출용 포맷
- **인쇄 친화적 레이아웃**: 불필요한 UI 요소 제거
- **전체 내용 포함**: 모든 경력 사항 순차 표시

## 🚀 시작하기

### 로컬 실행
```bash
# 저장소 클론
git clone https://github.com/pipe-down/resume.git
cd resume

# 로컬 서버 실행 (Python)
python -m http.server 8000

# 또는 Node.js
npx serve

# 브라우저에서 접속
# http://localhost:8000
```

### GitHub Pages 배포
1. GitHub 저장소 Settings → Pages
2. Source: "Deploy from a branch" 선택
3. Branch: main (또는 master) 선택
4. 배포 URL: `https://pipe-down.github.io/resume/`

## 📝 사용 방법

### 일반 방문자 (공개 URL)
- `https://pipe-down.github.io/resume/`
- PDF 다운로드 버튼만 표시됨
- 편집 및 설정 기능 비활성화

### 관리자 모드 (본인만 사용)
- `https://pipe-down.github.io/resume/?key=a7B9x2mN4pQ8rT6uY3wZ5vC1kL0`
- ~~`?admin=true`~~ 방식은 보안상 더 이상 사용하지 않음
- 모든 편집 및 설정 기능 활성화
- 실시간 편집 가능

### 편집 방법
1. 관리자 모드로 접속
2. 우측 하단 "편집" 버튼 클릭
3. 텍스트 클릭하여 직접 수정
4. 기술 스택 추가/삭제
5. "저장하기" 클릭으로 완료

### 데이터 관리
- **JSON 내보내기**: 설정 → JSON 내보내기
- **JSON 불러오기**: 설정 → JSON 불러오기
- **초기화**: 설정 → 초기화

## 🏗️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **스타일링**: Tailwind CSS (CDN)
- **차트**: Chart.js
- **아이콘**: Font Awesome
- **폰트**: Pretendard
- **호스팅**: GitHub Pages

## 📁 프로젝트 구조

```
resume/
├── index.html          # 메인 이력서 파일
├── README.md          # 프로젝트 문서
├── .gitignore         # Git 제외 파일
├── CLAUDE.md          # AI 코딩 가이드라인
└── docs/              # 인사평가 문서 (gitignore)
    └── 2025_인사평가/
```

## 🔧 커스터마이징

### 색상 변경
```css
/* index.html 내 <style> 섹션에서 수정 */
.section-title { color: #111827; }
.nav-item { color: #374151; }
```

### 섹션 추가
HTML 구조에 새로운 섹션 추가 가능:
```html
<section id="new-section" class="mb-12 scroll-mt-20">
    <h2 class="section-title">새 섹션</h2>
    <!-- 내용 -->
</section>
```

## 🌟 주요 성과 표시

- **발주 검색**: 20초 → 0.1초 (99.5% 개선)
- **프로젝트 현황**: 20초 → 0.3초 (98.5% 개선)
- **월 마감 관리**: 20초 → 1초 (95% 개선)
- **휴가 신청**: 15초 → 2초 (86.7% 개선)

## ⚠️ 주의사항

1. **브라우저 호환성**: Chrome, Firefox, Safari, Edge 최신 버전
2. **개인정보 보호**: 민감한 정보는 public 저장소에 커밋하지 마세요
3. **백업**: 정기적으로 JSON 파일로 백업 권장
4. **관리자 URL**: 관리자 모드 URL은 비공개로 유지

---

Made by 박정호