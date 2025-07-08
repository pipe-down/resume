# Admin 모드 보안 강화 가이드

## 현재 상황
- URL 파라미터 `?admin=true`로 관리자 모드 활성화
- 누구나 URL을 알면 편집 가능
- 클라이언트 사이드에서만 검증

## 보안 강화 방법

### 1. 즉시 적용 가능한 방법 (클라이언트 사이드)

#### A. 복잡한 토큰 방식
```javascript
// 예: ?token=a1b2c3d4e5f6 처럼 추측하기 어려운 토큰 사용
const ADMIN_TOKEN = 'your-secret-token-here';
const isAdminMode = urlParams.get('token') === ADMIN_TOKEN;
```

#### B. 시간 제한 토큰
```javascript
// 토큰에 타임스탬프 포함
function generateTimeBasedToken() {
    const timestamp = Date.now();
    const secret = 'your-secret';
    return btoa(`${timestamp}-${secret}`);
}

function validateToken(token) {
    try {
        const decoded = atob(token);
        const [timestamp] = decoded.split('-');
        const tokenAge = Date.now() - parseInt(timestamp);
        // 30분 유효
        return tokenAge < 30 * 60 * 1000;
    } catch {
        return false;
    }
}
```

#### C. 로컬 스토리지 + 패스워드
```javascript
// 패스워드 입력 후 로컬 스토리지에 저장
function enableAdminMode() {
    const password = prompt('관리자 패스워드를 입력하세요:');
    const hashedPassword = btoa(password); // 실제로는 더 안전한 해싱 사용
    
    if (hashedPassword === 'your-hashed-password') {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('authExpiry', Date.now() + 3600000); // 1시간
        return true;
    }
    return false;
}

function checkAdminAuth() {
    const auth = localStorage.getItem('adminAuth');
    const expiry = localStorage.getItem('authExpiry');
    
    if (auth === 'true' && expiry && Date.now() < parseInt(expiry)) {
        return true;
    } else {
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('authExpiry');
        return false;
    }
}
```

### 2. 더 안전한 방법 (서버 필요)

#### A. OAuth 인증
- GitHub OAuth 활용
- Google OAuth 활용

#### B. JWT 토큰
- 서버에서 발급한 JWT 토큰 검증

#### C. Basic Auth
- 서버에서 Basic Authentication 구현

### 3. GitHub Pages에서 구현 가능한 최선의 방법

```javascript
// 환경 변수처럼 사용할 설정
const ADMIN_CONFIG = {
    // 복잡한 액세스 키
    accessKey: 'a7B9x2mN4pQ8rT6uY3wZ5vC1kL0',
    // IP 화이트리스트 (옵션)
    allowedIPs: ['127.0.0.1', '::1'],
    // 세션 타임아웃 (밀리초)
    sessionTimeout: 30 * 60 * 1000, // 30분
};

// 향상된 관리자 인증
class AdminAuth {
    constructor() {
        this.sessionKey = 'adminSession';
    }

    // 액세스 키로 인증
    authenticate(key) {
        if (key === ADMIN_CONFIG.accessKey) {
            const session = {
                authenticated: true,
                timestamp: Date.now(),
                fingerprint: this.generateFingerprint()
            };
            
            // 세션 암호화 저장
            const encrypted = btoa(JSON.stringify(session));
            sessionStorage.setItem(this.sessionKey, encrypted);
            return true;
        }
        return false;
    }

    // 세션 유효성 검증
    isAuthenticated() {
        try {
            const encrypted = sessionStorage.getItem(this.sessionKey);
            if (!encrypted) return false;

            const session = JSON.parse(atob(encrypted));
            const now = Date.now();

            // 타임아웃 체크
            if (now - session.timestamp > ADMIN_CONFIG.sessionTimeout) {
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

    // 브라우저 핑거프린트 생성
    generateFingerprint() {
        const data = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset()
        ].join('|');
        
        return btoa(data);
    }

    // 로그아웃
    logout() {
        sessionStorage.removeItem(this.sessionKey);
    }
}

// 사용 예시
const adminAuth = new AdminAuth();

// URL에서 키 확인
const urlParams = new URLSearchParams(window.location.search);
const accessKey = urlParams.get('key');

if (accessKey) {
    if (adminAuth.authenticate(accessKey)) {
        // 인증 성공 후 URL에서 키 제거
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// 관리자 모드 확인
const isAdminMode = adminAuth.isAuthenticated();
```

### 4. 추가 보안 조치

1. **콘텐츠 보안 정책 (CSP) 헤더 추가**
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

2. **난독화**
- JavaScript 코드 난독화로 리버스 엔지니어링 방지

3. **환경 분리**
- 개발 환경과 프로덕션 환경 분리
- 프로덕션에서는 편집 기능 완전 제거

4. **로깅 및 모니터링**
- 관리자 접근 시도 로깅
- 비정상적인 접근 패턴 감지

## 권장 구현

GitHub Pages 환경에서는 서버가 없으므로, 다음 조합을 권장합니다:

1. 복잡한 액세스 키 사용
2. 세션 기반 인증 (sessionStorage)
3. 시간 제한
4. 브라우저 핑거프린팅
5. URL에서 즉시 키 제거

이렇게 하면 단순한 `admin=true`보다 훨씬 안전한 관리자 모드를 구현할 수 있습니다.