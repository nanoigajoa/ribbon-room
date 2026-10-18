# B4.1 실제 연주 시간 이벤트 변환

사용자의 다음 구현 요청에 따라 기존 DTW A를 임시 기준으로 사용한다. 정렬 승인·수동 측정은 대기다.
새 performance/0.1.0은 원본 음표 전체를 score_event로 보존하고 연주 원본·발췌 시각을 구분한다.
score excerpt의 보이는 beat 시작·끝을 각각 변환하며, crop과 겹치지 않는 이벤트는 반열림 구간 규칙으로 제외한다.
194개 음표의 원본 필드·ID·pitch·velocity/dynamics 결측을 그대로 유지했다. 모든 끝점은 초 축 lookup과도 일치한다.
전체 원음은 원본 0–22초로 바이트 일치한다. data-only 8–12초 crop에서 양 끝 clipping과 원본 필드 보존을 확인한다.
브라우저는 준비된 performance-ribbon/0.1.0의 실제 초 좌표로 공유 RibbonScene을 읽는다.
고정 playhead와 125px/연주초 등속 전역 이동, 발음 판정은 기존 A의 대응 시각이다. 물리효과가 아니다.
공유 SVG 901개 시점(정확한 경계와 양옆 포함)을 canonical performance endpoint와 검사했다.
기존 파일 596개 해시를 보존했다. 정렬 정확도·브라우저 실제 재생·청취는 미검증이다.
이전 retime_score·0.1.0 라이브러리·음원과 과거 outputs를 변경하지 않는다. 영상 출력은 다음 B4.2 범위다.
