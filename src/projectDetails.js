export const projectDetails = {
  'Run a B': {
    ko: [
      ['문제 정의', '소상공인이 여러 정책 공고를 직접 읽고 자신의 사업 조건과 비교해야 하는 탐색 부담에 주목했습니다. 공고를 모아 보여주는 데서 나아가 정책 원문을 해석하고 지원사업 선택에 필요한 정보를 제공하는 서비스를 기획했습니다.'],
      ['서비스 흐름', '통합 정책 허브에서 공고 탐색 → 정책 원문 분석 → 사업 조건에 맞는 지원사업 추천과 리포트 제공으로 이어지는 흐름을 설계했습니다.'],
      ['직접 담당한 작업', '팀장으로 서비스 방향과 기능 구성을 기획하고 LLM 파인튜닝을 담당했습니다. PyTorch와 Hugging Face Transformers를 활용하고, LoRA 기반의 파라미터 효율적 학습을 적용했습니다.'],
      ['기술 선택', '정책 문서 해석을 LLM 활용 과제로 다뤘으며, 전체 모델을 다시 학습하는 부담을 줄이는 LoRA를 학습 방식으로 활용했습니다. 서비스는 React 프론트엔드와 Spring Boot 백엔드로 구성했습니다.'],
      ['기여 범위와 검증', '개인 담당은 서비스 기획·LLM 파인튜닝·팀 리딩입니다. 프론트엔드와 백엔드는 팀 전체의 기술 구성입니다. 공개된 정량 평가 수치가 없어 추천 정확도나 운영 성과를 임의로 제시하지 않습니다.']
    ],
    en: [
      ['Problem', 'Small business owners need to read policy notices and compare eligibility with their own circumstances. The project goes beyond collecting notices to interpreting source documents and supporting program selection.'],
      ['Service flow', 'Browse a unified policy hub → analyze source documents → receive business-relevant program recommendations and reports.'],
      ['My contribution', 'Led service planning and LLM fine-tuning using PyTorch, Hugging Face Transformers and LoRA-based parameter-efficient adaptation.'],
      ['Technical choices', 'Used an LLM for policy-document interpretation and LoRA to reduce the trainable-parameter burden. The team application combines a React frontend with a Spring Boot backend.'],
      ['Scope and evidence', 'My role covered planning, model fine-tuning and team leadership. The application stack describes the team system, not sole ownership. No unverified accuracy or production-impact metrics are claimed.']
    ]
  },
  Reply: {
    ko: [
      ['문제 정의', '유해한 댓글을 무조건 삭제하면 원래 대화의 의미까지 사라질 수 있다는 문제에서 출발했습니다. 표현의 공격성을 낮추면서 문맥을 남기는 유튜브 댓글 순화 서비스를 기획했습니다.'],
      ['서비스 흐름', '브라우저 확장 프로그램이 댓글을 감지하고, AI API가 유해 표현을 판별한 뒤 문맥을 보존하는 표현으로 순화하는 흐름입니다.'],
      ['직접 담당한 작업', 'AI를 어디에 활용할지와 사용자가 순화된 댓글을 접하는 서비스 흐름을 기획했습니다. 프로젝트의 문제·접근 방식·활용 시나리오를 정리해 발표에 참여했습니다.'],
      ['기술 구성', '팀의 기술 구성은 JavaScript·HTML 기반 브라우저 확장과 Python·OpenAI API·AWS입니다. AI API를 활용한 표현 판별과 재작성 시나리오를 서비스 기획에 연결했습니다.'],
      ['기여 범위', '개인 역할은 기획과 발표입니다. 확장 프로그램·AI 처리·인프라 전체를 직접 구현한 것으로 표현하지 않으며, 검증되지 않은 유해 표현 탐지 정확도를 제시하지 않습니다.']
    ],
    en: [
      ['Problem', 'Deleting harmful comments can also remove the meaning of a conversation. Reply explores reducing hostile language while retaining the context of YouTube comments.'],
      ['Service flow', 'A browser extension detects comments → an AI API identifies harmful language → the text is rewritten to preserve context.'],
      ['My contribution', 'Planned AI use cases and the user-facing workflow. Helped explain the problem, approach and service scenarios through the project presentation.'],
      ['Team stack', 'JavaScript and HTML for the extension, with Python, OpenAI API and AWS in the overall service architecture.'],
      ['Scope', 'My contribution was planning and presentation, not end-to-end implementation of the extension or infrastructure. No unverified detection metrics are claimed.']
    ]
  },
  Speaki: {
    ko: [
      ['기간 · 상태', '2026.08 ~ 진행 중. Team Leader · AI Developer로 참여하고 있습니다.'],
      ['문제 정의', '터치스크린 사용이 어려운 시각장애인·고령자·손 사용이 불편한 사용자가 음성으로 주문할 수 있는 배리어프리 키오스크입니다. 음성 인식에서 끝나지 않고 메뉴·수량·옵션·의도를 구조화해 주문 확정까지 연결하는 것을 목표로 합니다.'],
      ['주문 파이프라인', '음성 → STT → 인식 문장 사용자 확인 → RAG / SLM → 주문 정보 구조화 → 주문 후보 확인 → Backend DB 검증 → 주문 확정. 실제 메뉴·가격·재고·판매 여부를 검증하고 수정·취소 명령을 처리하는 구조를 설계했습니다.'],
      ['프로젝트 리딩', '아이디어 제안, 산학협력 회사와 요구사항 협의, 팀원·회사 의견 조율을 담당했습니다. 개발 영역별 역할을 나누고 9~12월 일정과 Gantt Chart를 작성하며 기획 발표와 기술 방향을 정리했습니다.'],
      ['Whisper 비교 실험', '동일 주문 음성으로 base·small·medium을 비교하고 한국어·사투리 인식을 테스트했습니다. 비교한 사투리 음성에서는 medium이 상대적으로 안정적이었습니다. 주문 도메인 initial prompt, beam size 5, temperature 0, 이전 문장 의존성 제거 등의 설정을 검토·조정했습니다. 정량 정확도나 지연시간 수치는 아직 제시하지 않습니다.'],
      ['서버와 개발 구조', '키오스크는 녹음·전송, GPU AI 서버는 추론을 담당하도록 설계했습니다. 초기에는 스트리밍 대신 녹음 종료 후 .m4a·.wav 파일을 HTTP API로 전달해 프론트엔드 완성 전에도 독립적으로 검증하도록 했습니다. frontend / backend / ai Monorepo와 기능 브랜치로 개발 영역을 분리했습니다.'],
      ['도입 검토', 'faster-whisper, CUDA·FP16 및 학교 NVIDIA A4000 16GB 활용을 검토했습니다. RAG·SLM을 통한 주문 해석은 설계 범위이며 전체 기능의 구현·운영 완료를 의미하지 않습니다.'],
      ['설계에서 배운 점', '모델 정확도뿐 아니라 추론 속도·GPU 자원·네트워크·개발 역할 분담을 함께 고려해야 했습니다. AI가 틀릴 수 있음을 전제로 사용자 확인과 실제 DB 검증을 분리한 점이 핵심입니다.']
    ],
    en: [
      ['Timeline and status', 'August 2026–present. Team Leader and AI Developer; work in progress.'],
      ['Problem', 'A barrier-free voice-ordering kiosk for people who find touchscreens difficult to use. The goal extends speech recognition into structured menu items, quantities, options and intent.'],
      ['Order pipeline', 'Audio → STT → transcript confirmation → RAG / SLM → structured order → candidate confirmation → backend database validation → order confirmation. The design separates interpretation from menu, price, stock and availability checks.'],
      ['Leadership', 'Proposed the concept, discussed requirements with the industry partner, coordinated feedback, assigned responsibilities and prepared the September–December schedule and Gantt chart.'],
      ['Whisper experiments', 'Compared base, small and medium with identical order recordings, including Korean dialect speech. Medium was qualitatively more stable on the dialect samples tested. Explored domain prompts, beam size 5, temperature 0 and disabling previous-text conditioning. No quantitative accuracy or latency claims are made.'],
      ['Architecture', 'Designed a recording client and a GPU inference server. Initially chose HTTP uploads of completed .m4a / .wav recordings over streaming to enable independent AI testing. Split frontend, backend and AI work in a monorepo with feature branches.'],
      ['Under evaluation', 'Evaluated faster-whisper, CUDA, FP16 and a school NVIDIA A4000 16GB as deployment options. RAG / SLM order interpretation is part of the design, not a claim of a completed production system.'],
      ['Learning', 'Model quality must be considered alongside latency, GPU resources, networking and team responsibilities. User confirmation and database validation explicitly account for AI errors.']
    ]
  }
};
