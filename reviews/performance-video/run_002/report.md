# B4.2 실제 원음 리본 영상

B4.1 run_001의 performance JSON·원음·설정을 사용해 22초/30fps/1440×900 MP4를 생성했다.
공유 RibbonScene에 frame/30을 입력하고 660개 SVG의 발음 ID·pitch를 canonical performance endpoint와 대조했다.
Chrome을 한 번 실행했으나 실패했다. 같은 SVG를 기존 Matplotlib Agg로 래스터화하고 FFmpeg H264/AAC로 결합했다.
브라우저 캡처 또는 Remotion의 Chrome 렌더 성공으로 표시하지 않는다. 글꼴 렌더는 native Arial/AppleGothic이다.
SVG 어댑터는 현재 사용하는 요소·clip·translation·opacity만 지원하며 미지원 그래픽은 거절한다.
앞 무음·후반 문맥을 포함한 원본 0–22초를 보존한다. 물리효과·음원 강조·새 정렬 보정은 없다.
모든 영상 프레임 PTS와 시작·길이·해상도·채널을 검사했다. 대표 12개 MP4 프레임을
원본 raster와 대조하고 프레임·playhead 확대 그림을 생성했다. AAC decode padding은 media_checks.json에 구분했다.
음원 상관·lag는 mux 검증이며 note alignment 오차가 아니다. 기존 DTW A 정확도·사람의 청취는 대기다.
기존 파일 633개 해시를 보존했다. 원본 WAV·performance 입력은 바이트 일치한다.
