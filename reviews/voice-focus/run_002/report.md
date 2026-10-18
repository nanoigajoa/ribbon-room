# B2.3 — 任意 성부 리본·소리 강조 실험

사용자 정정: 비올라 고정이 아니라 원하는 성부 하나를 선택. 범위 확인: 리본과 소리 모두.
실제 Musopen String Quartet 멘델스존 Op.80 I악장 첫 17.484521초를 사용했다.
원음과 네 성부 강조 버전은 같은 48kHz/stereo/sample count다. 음원 합성은 하지 않았다.

악보 첫 12마디(48 quarter beats)의 기보 순서가 도입부에 대응한다는 가정으로 35초 안에서
symbolic chroma/CQT subsequence DTW endpoint를 찾고 RMS origin으로 고정 재계산했다.
반복/도약 탐색이나 수동 정확도 평가는 하지 않았다. alignment.json은 자동 초안이며 정답이 아니다.
원래 0.3.0 악보 JSON의 beat·source_note_id·pitch·초 좌표를 보존하고 브라우저에서 역함수로 시계를 읽는다.
같은 음을 반복하는 저음과 모호한 attack은 chroma만으로 정확히 분리하지 못한다.

화면은 임의 part ID를 선택해 나머지 opacity를 .45로 낮춘다. 특정 악기 이름을 하드코딩하지 않는다.
현재 4파트를 성부 선택 단위로 쓰며 한 파트 안의 별도 대위 성부 자동 추출은 하지 않는다.
소리는 선택 음표의 fundamental/harmonics neighborhood를 soft mask로 부각한다.
같은 음높이·배음을 공유하면 구분할 근거가 없어 마스크를 공유한다. 다른 악기 성분과 잔향이 남는다.
STFT 위상을 유지하고 stereo 양 채널에 같은 마스크를 적용했다. 가중치는 0.6+1.2*mask,
모든 버전의 공통 peak gain은 1.000000이다. 전체는 같은 gain의 원음이다.
새로운 note audio를 만들거나 완전 분리/solo라고 표시하지 않는다.

sample grid·finite·peak·STFT identity·마스크 overlap·기지 주파수의 gain 대비 및 UI 선택 로직을 검사했다.
이 검사는 실제 귀로 들은 분리 품질이나 음표 정렬 오차를 보장하지 않는다. 사람이 듣는 검토는 대기다.
원본 및 기존 결과 464개 파일의 해시를 보존했다.
공식 API: https://librosa.org/doc/0.11.0/generated/librosa.sequence.dtw.html
https://librosa.org/doc/0.11.0/generated/librosa.stft.html
https://librosa.org/doc/0.11.0/generated/librosa.istft.html
