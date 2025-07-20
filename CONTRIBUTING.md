# 🤝 협업 가이드

BKPOP 인쇄몰 프로젝트에 기여해주셔서 감사합니다! 이 가이드는 효과적인 협업을 위한 규칙과 절차를 안내합니다.

## 📋 목차

- [시작하기](#시작하기)
- [개발 환경 설정](#개발-환경-설정)
- [코딩 규칙](#코딩-규칙)
- [Git 워크플로우](#git-워크플로우)
- [코드 리뷰](#코드-리뷰)
- [테스트](#테스트)
- [배포](#배포)

## 🚀 시작하기

### 1. 저장소 복제
```bash
git clone https://github.com/your-org/bkpop-nextjs.git
cd bkpop-nextjs
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
# .env.local 파일 생성
cp .env.example .env.local

# 필요한 환경 변수 설정
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=bkpop_db
# JWT_SECRET=your_jwt_secret
```

### 4. 데이터베이스 설정
```bash
# MySQL 서버 시작
brew services start mysql

# 데이터베이스 초기화
npm run db:migrate
npm run db:seed
```

### 5. 개발 서버 시작
```bash
npm run dev
```

## 🛠️ 개발 환경 설정

### 필수 도구
- **Node.js**: 18.x 이상
- **npm**: 9.x 이상
- **MySQL**: 8.0 이상
- **Docker**: 최신 버전 (선택사항)

### 권장 VS Code 확장
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **TypeScript Importer**
- **Tailwind CSS IntelliSense**
- **GitLens**

### 개발 환경 설정
```bash
# Prettier 설정
npm run format

# ESLint 설정
npm run lint:fix

# 타입 체크
npm run type-check
```

## 📝 코딩 규칙

### 1. 코드 스타일
- **Prettier** 사용으로 일관된 코드 포맷팅
- **ESLint** 규칙 준수
- **TypeScript** 사용 (any 타입 금지)

### 2. 명명 규칙
```typescript
// 컴포넌트: PascalCase
const UserProfile = () => {};

// 변수/함수: camelCase
const userName = 'john';
const getUserData = () => {};

// 상수: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';

// 파일명: kebab-case
user-profile.tsx
api-client.ts
```

### 3. 폴더 구조
```
src/
├── app/                    # Next.js 앱 라우터
├── components/            # 재사용 가능한 컴포넌트
│   ├── Common/           # 공통 컴포넌트
│   ├── Admin/            # 관리자 컴포넌트
│   └── ...
├── lib/                   # 라이브러리 및 유틸리티
├── hooks/                # 커스텀 훅
├── contexts/             # React 컨텍스트
├── types/                # TypeScript 타입 정의
├── utils/                # 유틸리티 함수
└── __tests__/            # 테스트 파일
```

### 4. 컴포넌트 구조
```typescript
/**
 * 사용자 프로필 컴포넌트
 * @description 사용자 정보를 표시하는 컴포넌트
 */

'use client';

import React from 'react';
import { User } from '@/types';

interface UserProfileProps {
  user: User;
  onEdit?: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit }) => {
  // 컴포넌트 로직
  
  return (
    <div className="user-profile">
      {/* JSX 내용 */}
    </div>
  );
};

export default UserProfile;
```

## 🔄 Git 워크플로우

### 1. 브랜치 전략
```
main         # 프로덕션 브랜치
└── develop  # 개발 브랜치
    ├── feature/user-management    # 기능 브랜치
    ├── feature/product-catalog    # 기능 브랜치
    ├── bugfix/cart-issue         # 버그 수정 브랜치
    └── hotfix/security-patch     # 핫픽스 브랜치
```

### 2. 커밋 메시지 규칙
[Conventional Commits](https://www.conventionalcommits.org/) 사용

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**타입:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 스타일 변경
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 도구, 패키지 매니저 등

**예시:**
```
feat(auth): JWT 기반 인증 시스템 구현

- JWT 토큰 생성 및 검증 로직 추가
- 로그인/로그아웃 API 엔드포인트 구현
- 인증 미들웨어 구현

Closes #123
```

### 3. 브랜치 작업 플로우
```bash
# 1. 최신 develop 브랜치로 이동
git checkout develop
git pull origin develop

# 2. 새 기능 브랜치 생성
git checkout -b feature/user-management

# 3. 작업 및 커밋
git add .
git commit -m "feat(user): 사용자 관리 기능 추가"

# 4. 푸시 및 PR 생성
git push origin feature/user-management
# GitHub에서 Pull Request 생성
```

## 👀 코드 리뷰

### 1. Pull Request 규칙
- **제목**: 명확하고 간결한 제목
- **설명**: 변경사항 상세 설명
- **리뷰어**: 최소 2명 이상
- **테스트**: 모든 테스트 통과
- **충돌**: 머지 충돌 해결

### 2. 리뷰 체크리스트
- [ ] 코드 스타일 가이드 준수
- [ ] 타입 안정성 확인
- [ ] 테스트 커버리지 적절
- [ ] 성능 영향 검토
- [ ] 보안 취약점 검토
- [ ] 문서 업데이트 필요성

### 3. 리뷰 코멘트 예시
```markdown
# 좋은 코멘트
- "이 함수는 너무 복잡합니다. 더 작은 함수로 분리하는 것이 좋겠습니다."
- "타입 안정성을 위해 any 대신 구체적인 타입을 사용해주세요."
- "이 로직에 대한 테스트 케이스를 추가해주세요."

# 피해야 할 코멘트
- "이상해요."
- "다시 해주세요."
- "틀렸어요."
```

## 🧪 테스트

### 1. 테스트 종류
```bash
# 단위 테스트
npm run test:unit

# 통합 테스트
npm run test:integration

# E2E 테스트
npm run test:e2e

# 커버리지 확인
npm run test:coverage
```

### 2. 테스트 작성 가이드
```typescript
// __tests__/unit/utils/auth.test.ts
import { validatePassword } from '@/utils/auth';

describe('validatePassword', () => {
  it('should return true for valid password', () => {
    expect(validatePassword('Aa123456!')).toBe(true);
  });

  it('should return false for weak password', () => {
    expect(validatePassword('123')).toBe(false);
  });
});
```

### 3. 테스트 커버리지 목표
- **라인 커버리지**: 80% 이상
- **브랜치 커버리지**: 70% 이상
- **함수 커버리지**: 80% 이상

## 🚀 배포

### 1. 배포 환경
- **개발**: `develop` 브랜치 → Staging 환경
- **프로덕션**: `main` 브랜치 → Production 환경

### 2. 배포 전 체크리스트
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료
- [ ] 환경 변수 설정 확인
- [ ] 데이터베이스 마이그레이션 필요성 확인
- [ ] 롤백 계획 수립

### 3. 배포 명령어
```bash
# 개발 환경 배포
npm run deploy:staging

# 프로덕션 환경 배포
npm run deploy:production

# 롤백
npm run rollback
```

## 📞 문의 및 지원

### 1. 이슈 보고
- **버그**: GitHub Issues에 버그 템플릿 사용
- **기능 요청**: GitHub Issues에 기능 요청 템플릿 사용
- **질문**: GitHub Discussions 활용

### 2. 연락처
- **이메일**: dev@bkpop.com
- **슬랙**: #bkpop-dev 채널
- **문서**: [프로젝트 위키](https://github.com/your-org/bkpop-nextjs/wiki)

## 🎯 성공적인 협업을 위한 팁

### 1. 커뮤니케이션
- **명확한 의사소통**: 애매한 표현 지양
- **정기적인 동기화**: 스탠드업 미팅 참여
- **문서화**: 중요한 결정사항 기록

### 2. 코드 품질
- **작은 단위 커밋**: 한 번에 하나의 변경사항
- **테스트 우선**: 테스트 작성 후 구현
- **리팩토링**: 지속적인 코드 개선

### 3. 학습과 성장
- **코드 리뷰 적극 참여**: 서로 배우고 가르치기
- **새로운 기술 도입**: 합의된 기술 스택 사용
- **문제 해결**: 혼자 고민하지 말고 팀에 도움 요청

---

**Happy Coding! 🎉**

더 나은 협업을 위한 제안이나 질문이 있으시면 언제든지 문의해주세요! 