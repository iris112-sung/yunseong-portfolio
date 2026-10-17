const copy = (ko, en) => ({ ko, en });

export const projectCaseStudies = {
  'run-a-b': {
    accent: '#7350ad', wash: '#eeebf7',
    status: copy('기획 · LLM 파인튜닝', 'Planning · LLM fine-tuning'),
    period: copy('정책 분석 서비스', 'Policy analysis service'),
    premise: copy('공고를 찾는 일에서,\n내 사업의 가능성을 읽는 일로.', 'From finding a notice\nto understanding an opportunity.'),
    intro: copy('지원사업은 많지만, 나에게 해당하는 조건을 읽어내는 일은 여전히 어렵습니다. Run a B는 정책 원문과 사업자의 상황 사이를 연결하는 AI 서비스를 고민한 프로젝트입니다.', 'There is no shortage of policy notices. Understanding which conditions apply to a business is harder. Run a B explores an AI service that connects source documents with the circumstances of small business owners.'),
    question: copy('정책을 요약하는 것만으로, 신청 여부를 결정할 수 있을까?', 'Is a summary enough to decide whether to apply?'),
    answer: copy('공고를 모으는 기능에 더해 지원 조건을 해석하고, 사업자에게 필요한 정보를 추천과 리포트로 연결하는 방향을 잡았습니다. 핵심은 답변의 유창함보다 정책 원문과의 연결입니다.', 'The direction combines discovery, eligibility interpretation and business-relevant recommendations and reports. The important part is the connection to the source, not just a fluent answer.'),
    flow: [
      { title: copy('정책 탐색', 'Discover'), body: copy('통합 허브에서 지원사업 공고를 살펴봅니다.', 'Browse support-program notices in a unified hub.') },
      { title: copy('원문 해석', 'Interpret'), body: copy('정책 문서의 대상과 조건을 AI 분석 과제로 다룹니다.', 'Interpret the intended applicants and conditions in the source document.') },
      { title: copy('추천과 리포트', 'Recommend'), body: copy('사업 조건에 맞는 정보를 선택과 검토로 이어줍니다.', 'Bring business-relevant information into a recommendation and report.') }
    ],
    issues: [
      { kind: copy('기술 선택', 'Technical choice'), title: copy('전체 모델 학습의 부담을 줄이기', 'Reducing the burden of full-model training'), problem: copy('정책 문서 해석에 모델을 맞추면서도 전체 파라미터를 다시 학습하는 부담을 고려해야 했습니다.', 'Adapting the model to policy interpretation also required considering the cost of training all parameters.'), decision: copy('PyTorch와 Hugging Face Transformers를 사용하고, LoRA 기반의 파라미터 효율적 파인튜닝을 적용했습니다.', 'Used PyTorch, Hugging Face Transformers and LoRA-based parameter-efficient fine-tuning.'), result: copy('LoRA를 학습 방식으로 선택했습니다. 메모리 절감률이나 학습 시간 개선 수치는 별도로 기록되지 않았습니다.', 'LoRA was the chosen training method. Memory savings and training-time improvements have not been quantified in the available record.') },
      { kind: copy('설계 이슈', 'Design consideration'), title: copy('정책 요약과 지원 자격 판단을 구분하기', 'Separating a summary from an eligibility decision'), problem: copy('읽기 쉬운 요약이라도 조건과 예외가 빠지면 실제 신청 판단에 충분하지 않을 수 있습니다.', 'A readable summary can still omit conditions and exceptions needed for an application decision.'), decision: copy('정책 원문 분석을 별도 단계로 두고, 추천과 리포트가 어떤 조건을 근거로 하는지 검토하는 방향으로 설계했습니다.', 'Designed source-document analysis as a separate step and identified eligibility reasoning as a review requirement.'), result: copy('서비스 설계에서 다룬 과제입니다. 조건 누락률과 추천 근거 일치 여부는 후속 검증 항목입니다.', 'This is a design consideration. Missing-condition rates and consistency with recommendation evidence remain validation tasks.') },
      { kind: copy('검증 과제', 'Validation task'), title: copy('그럴듯한 답변과 유효한 추천 사이', 'A plausible answer is not a validated recommendation'), problem: copy('자연스럽게 작성된 리포트만으로 추천 품질이 증명되지는 않습니다.', 'A well-written report alone does not establish recommendation quality.'), decision: copy('조건 일치, 원문 근거, 예외 조건을 분리해 평가하는 기준을 다음 검증 과제로 정리했습니다.', 'The next evaluation should separate eligibility matching, source evidence and exception handling.'), result: copy('공개된 정량 평가가 없어 정확도나 운영 성과를 수치로 제시하지 않습니다.', 'No public quantitative evaluation is available, so no accuracy or production-impact figures are claimed.') }
    ],
    benchmarks: [
      { name: '기업마당', url: 'https://www.bizinfo.go.kr/sii/siia/selectSIIA200View.do', observation: copy('분야별 지원사업 공고를 탐색하는 정책 정보 서비스.', 'A policy-information service for browsing support-program notices.'), lesson: copy('공고를 찾는 경험 다음에, 내 사업과 조건을 비교하는 해석 단계를 연결합니다.', 'Connect notice discovery to an interpretation step that compares conditions with the business.') },
      { name: '소상공인24', url: 'https://www.sbiz24.kr/', observation: copy('소상공인 지원사업 조회와 신청을 한곳에 모은 통합 플랫폼.', 'An integrated platform for discovering and applying to small-business support programs.'), lesson: copy('추천 리포트가 실제 공고 확인과 신청 검토로 이어져야 한다는 기준을 얻습니다.', 'A recommendation report should lead back to the actual notice and application review.') }
    ],
    takeaway: copy('좋은 정책 AI는 답을 길게 쓰기보다, 판단할 근거를 남겨야 합니다.', 'A useful policy AI should leave a basis for judgment, not just a longer answer.'),
    next: copy(['추천 조건과 원문 근거의 일치 여부 평가', '예외·제외 조건을 포함한 테스트 사례 정리', '리포트에서 원문으로 돌아가는 검토 흐름 구체화'], ['Evaluate consistency between recommendations and source evidence', 'Build cases covering exceptions and exclusions', 'Refine the review path from a report back to the source'])
  },
  reply: {
    accent: '#367462', wash: '#e8f1ed',
    status: copy('서비스 기획 · 발표', 'Service planning · Presentation'),
    period: copy('브라우저 확장 서비스', 'Browser extension concept'),
    premise: copy('표현은 부드럽게.\n대화의 의미는 그대로.', 'Softer words.\nThe same conversation.'),
    intro: copy('불편한 댓글을 지우는 것만이 유일한 방법일까요? Reply는 유튜브 댓글의 공격적인 표현을 낮추면서, 사용자가 말하려던 맥락은 남길 수 있을지에서 출발했습니다.', 'Is deleting a difficult comment the only option? Reply started with a question: can hostile wording be softened while preserving what the person was trying to say?'),
    question: copy('유해 표현을 줄이면서, 원래 의견을 남길 수 있을까?', 'Can we reduce harm without erasing the original opinion?'),
    answer: copy('브라우저에서 댓글을 감지하고 AI가 표현을 판별·순화하는 흐름을 기획했습니다. 제 역할은 AI 활용 시나리오와 사용자 경험을 정리하고 프로젝트의 접근 방식을 발표하는 일이었습니다.', 'Planned a flow in which a browser extension detects comments and an AI API identifies and rewrites harmful wording. My contribution was defining the AI use cases, user workflow and project presentation.'),
    flow: [
      { title: copy('댓글 감지', 'Detect'), body: copy('브라우저 확장 프로그램에서 댓글을 받아옵니다.', 'A browser extension detects the comment.') },
      { title: copy('표현 판별', 'Assess'), body: copy('AI API를 활용해 유해 표현을 판별하는 시나리오입니다.', 'An AI API assesses potentially harmful language.') },
      { title: copy('맥락을 남긴 순화', 'Rewrite'), body: copy('의견을 유지하며 공격적인 표현을 바꾸는 방향입니다.', 'The concept rewrites hostile wording while preserving the opinion.') }
    ],
    issues: [
      { kind: copy('기획 이슈', 'Planning consideration'), title: copy('순화가 의견까지 바꿔버리지 않도록', 'Keeping a rewrite from changing the opinion'), problem: copy('공격성을 낮추는 과정에서 비판의 대상이나 이유가 달라지면 원래 대화가 왜곡됩니다.', 'Reducing hostility can distort a conversation if the target or reason for criticism changes.'), decision: copy('서비스의 핵심 목표를 삭제가 아닌 문맥 보존형 순화로 정의하고, 발표에서도 이 차이를 중심에 두었습니다.', 'Defined context-preserving rewriting, rather than deletion, as the service goal and the central point of the presentation.'), result: copy('기획에 반영한 기준입니다. 원문 대비 의미 보존 여부에 대한 정량 검증은 아직 기록되지 않았습니다.', 'This criterion is reflected in the concept. Quantitative validation of meaning preservation is not available.') },
      { kind: copy('검증 과제', 'Validation task'), title: copy('단어 하나만 보고 유해성을 판단하지 않기', 'Looking beyond a single word'), problem: copy('인용·반어·문맥에 따라 같은 표현도 다르게 해석될 수 있습니다.', 'Quotation, irony and context can change how the same expression should be interpreted.'), decision: copy('단순한 금칙어 일치와 AI 기반 문맥 판별의 차이를 검토하고, 문맥별 사례가 필요하다는 점을 정리했습니다.', 'Considered the distinction between keyword matching and contextual assessment, and the need for contextual examples.'), result: copy('오탐·미탐과 표현 보존을 함께 검토할 후속 평가 과제입니다. 탐지 정확도 수치를 임의로 제시하지 않습니다.', 'False positives, false negatives and meaning preservation need a joint evaluation. No detection-accuracy figures are invented.') },
      { kind: copy('기여 범위', 'Contribution scope'), title: copy('팀의 구현과 개인의 역할을 구분하기', 'Distinguishing the team system from my role'), problem: copy('팀의 전체 기술 구성이 개인의 전체 구현 경험으로 읽히지 않아야 합니다.', 'The overall team stack should not imply sole implementation ownership.'), decision: copy('JavaScript·HTML·Python·OpenAI API·AWS는 팀의 구성으로, 개인 기여는 기획과 발표로 구분했습니다.', 'The team stack includes JavaScript, HTML, Python, OpenAI API and AWS. My contribution was planning and presentation.'), result: copy('서비스 흐름과 의사결정을 설명하는 기획 중심의 프로젝트 기록입니다.', 'This case study focuses on the service workflow and planning decisions.') }
    ],
    benchmarks: [
      { name: 'YouTube 댓글 관리', url: 'https://support.google.com/youtube/answer/9483359?hl=ko', observation: copy('부적절할 수 있는 댓글을 보류하고 검토하는 관리 옵션을 제공합니다.', 'Provides moderation options that hold potentially inappropriate comments for review.'), lesson: copy('댓글의 노출을 관리하는 접근과 표현을 다시 쓰는 접근을 구분해 서비스 목표를 정의합니다.', 'Distinguish controlling visibility from rewriting language when defining the service goal.') },
      { name: 'Perspective API', url: 'https://developers.perspectiveapi.com/s/about-the-api-attributes-and-languages?language=en_US', observation: copy('댓글의 유해성 등 속성을 점수로 평가하는 API의 공개 문서.', 'Public API documentation describing scores for attributes such as toxicity.'), lesson: copy('유해성 판별과 문장 재작성은 서로 다른 단계이며, 의미 보존도 별도로 평가해야 합니다.', 'Assessment and rewriting are separate stages; meaning preservation also needs its own evaluation.') }
    ],
    takeaway: copy('안전한 대화 경험은 무엇을 지울지뿐 아니라, 무엇을 남길지에서 시작합니다.', 'A safer conversation starts with deciding what to preserve as well as what to remove.'),
    next: copy(['원문·순화문 쌍으로 의미 보존 평가 기준 정리', '인용·반어·복합 문맥의 예외 사례 수집', '사용자가 순화 결과를 신뢰할 수 있는 표시 방식 검토'], ['Define meaning-preservation criteria for original/rewrite pairs', 'Collect cases involving quotations, irony and mixed context', 'Review how to communicate rewritten content to users'])
  },
  speaki: {
    accent: '#ac4d72', wash: '#f6eaf0',
    status: copy('개발 진행 중', 'In progress'),
    period: copy('2026.08 ~ 진행 중', 'August 2026–present'),
    premise: copy('터치 대신 목소리로.\n주문이 끝나는 순간까지.', 'From a spoken request\nto a confirmed order.'),
    intro: copy('메뉴를 보고 화면을 누르는 일이 모두에게 쉽지는 않습니다. Speaki는 음성 인식에 머무르지 않고, 주문 의도를 구조화하고 실제 메뉴 정보와 대조하는 배리어프리 키오스크를 만들고 있습니다.', 'Reading a menu and using a touchscreen is not easy for everyone. Speaki is building a barrier-free kiosk that goes beyond transcription to structure order intent and check it against actual menu data.'),
    question: copy('말을 알아듣는 것과, 올바른 주문을 만드는 것은 같은 일일까?', 'Is recognizing speech the same as creating a correct order?'),
    answer: copy('아닙니다. 인식 문장 확인, 메뉴·수량·옵션 구조화, 주문 후보 확인, Backend DB 검증을 분리했습니다. 모델이 틀릴 수 있다는 전제가 주문 파이프라인의 출발점입니다.', 'No. Transcript confirmation, menu/quantity/option structuring, candidate confirmation and backend validation are separate steps. The pipeline starts from the assumption that the model can be wrong.'),
    flow: [
      { title: copy('음성 → STT', 'Audio → STT'), body: copy('녹음 파일을 HTTP API로 전송하고 음성을 텍스트로 바꿉니다.', 'Send a recording through HTTP and transcribe the audio.') },
      { title: copy('확인 → 구조화', 'Confirm → Structure'), body: copy('인식 문장 확인 후 메뉴·수량·옵션을 해석하는 설계입니다.', 'Confirm the transcript, then interpret menu items, quantities and options.') },
      { title: copy('검증 → 주문', 'Validate → Order'), body: copy('실제 DB의 메뉴·가격·재고·판매 여부를 검증하도록 설계했습니다.', 'The design checks actual menu, price, stock and availability data.') }
    ],
    issues: [
      { kind: copy('비교 실험', 'Experiment'), title: copy('한국어·사투리 주문 음성의 인식 차이', 'Recognition differences in Korean and dialect speech'), problem: copy('같은 주문 음성에서도 Whisper 모델 크기에 따라 인식 결과가 달랐습니다.', 'Whisper model sizes produced different results for the same order recordings.'), decision: copy('base·small·medium을 같은 음성으로 비교했습니다. 주문 도메인 initial prompt, beam size 5, temperature 0, 이전 문장 의존성 제거를 검토·조정했습니다.', 'Compared base, small and medium on identical recordings. Explored domain prompts, beam size 5, temperature 0 and disabling previous-text conditioning.'), result: copy('테스트한 사투리 샘플에서는 medium이 상대적으로 안정적이었습니다. 샘플 범위를 넘어 일반화하지 않으며 정확도·지연시간 수치는 아직 정리하지 않았습니다.', 'Medium was qualitatively more stable on the tested dialect samples. This is not generalized beyond those samples; accuracy and latency have not been quantified.') },
      { kind: copy('개발 방식', 'Development decision'), title: copy('화면이 완성되기 전에 AI를 검증하기', 'Testing AI before the interface is ready'), problem: copy('프론트엔드 완성을 기다리면 음성 인식 실험과 서버 검증도 함께 늦어질 수 있었습니다.', 'Waiting for the frontend could also delay speech experiments and server validation.'), decision: copy('초기에는 스트리밍 대신 녹음 종료 후 .m4a·.wav 파일을 HTTP API로 전달하도록 설계했습니다. 키오스크의 녹음·전송과 GPU 서버의 추론을 분리했습니다.', 'Initially designed uploads of completed .m4a/.wav recordings instead of streaming, separating recording/transmission from GPU inference.'), result: copy('AI 영역을 독립적으로 검증할 수 있는 개발 구조를 잡았습니다. 스트리밍은 후속 검토 범위입니다.', 'Established a structure for independent AI validation. Streaming remains a later consideration.') },
      { kind: copy('설계 이슈', 'Design consideration'), title: copy('인식한 메뉴가 실제로 판매 중인지 확인하기', 'Checking that an interpreted item is actually available'), problem: copy('인식과 해석이 자연스러워도 실제 메뉴·가격·재고와 다르면 주문을 확정할 수 없습니다.', 'Even a plausible interpretation cannot be confirmed if it conflicts with menu, price or stock data.'), decision: copy('AI 해석과 Backend DB 검증을 분리하고, 사용자에게 주문 후보를 확인받는 흐름을 설계했습니다. 수정·취소 명령도 처리 범위에 포함했습니다.', 'Separated AI interpretation from backend validation, with user confirmation of the order candidate and support for correction/cancellation in the design.'), result: copy('파이프라인 설계에 반영했습니다. RAG·SLM과 전체 주문 기능의 구현·운영 완료를 의미하지는 않습니다.', 'Reflected in the pipeline design. RAG/SLM interpretation and the full ordering workflow are not claimed as completed production features.') }
    ],
    benchmarks: [
      { name: 'CLOVA Speech', url: 'https://guide.ncloud-docs.com/docs/en/clovaspeech-overview', observation: copy('단문·장문·스트리밍 음성 인식과 결과 편집을 제공하는 음성 API 서비스.', 'A speech API service with short-form, long-form and streaming recognition and transcript editing.'), lesson: copy('인식 결과를 수정하고 확인하는 단계를 음성 주문 경험에도 분리해 둡니다.', 'Keep a distinct correction and confirmation step in the voice-ordering experience.') },
      { name: 'Google Cloud Speech-to-Text', url: 'https://docs.cloud.google.com/speech-to-text/docs/overview', observation: copy('음성을 받아 텍스트 전사 결과를 반환하며 여러 요청 방식을 제공합니다.', 'Accepts audio and returns transcriptions through several recognition request types.'), lesson: copy('STT의 출력과 실제 주문의 성공은 다릅니다. 주문 구조화와 DB 검증을 별도 책임으로 둡니다.', 'Transcription output and a successful order are different; structuring and database validation need separate responsibilities.') }
    ],
    takeaway: copy('모델이 잘 듣는 것보다, 사용자가 틀린 주문을 확정하지 않게 만드는 것이 중요합니다.', 'Preventing an incorrect confirmation matters as much as recognizing speech well.'),
    next: copy(['한국어·사투리 음성의 정확도와 추론 시간 정량화', 'faster-whisper·CUDA·FP16과 A4000 16GB 환경 검토', 'RAG / SLM 해석 및 Backend DB 검증 연결', '수정·취소·메뉴 품절을 포함한 주문 시나리오 검증'], ['Quantify accuracy and inference time on Korean/dialect recordings', 'Evaluate faster-whisper, CUDA, FP16 and the A4000 16GB environment', 'Connect RAG/SLM interpretation with backend validation', 'Validate correction, cancellation and unavailable-menu scenarios'])
  }
};
