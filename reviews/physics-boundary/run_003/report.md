# B5.1 고정점·폭 변형 영역

승인된 B4.2 performance_videos/run_002 A의 동일 SVG 위에 정적인 경계 overlay만 추가했다.
사용자의 “다음 구현해.” 요청으로 진행했다. B4.3 B 채택·정렬 정확도 승인을 뜻하지 않는다.
주 윤곽·모든 pitch strand·발음 marker·시간·원음은 고정한다. 대칭 보조 폭만 제안한다.
금색 최대 반폭 8px, 과거 0.9초 이내, 재생선 0.06초/모든 파트 이벤트 경계 0.025초 smoothstep taper다.
실제 note 내부에만 그려 쉼·note-off를 넘는 잔향은 없다. 어떤 dynamics나 accent도 추정하지 않는다.
이 값은 preset 확정이 아닌 경계 검토 제안이다. 스프링·관성·감쇠 시뮬레이션은 없다.
0.9초는 공간상 허용 영역 길이이며 동역학 pre-roll이나 초기 상태가 아니다.
모든 기존 A 660 SVG 해시와 overlay 제거 시 원본 SVG 일치를 검사했다.
발음 경계 ±0.1us·30fps 시점에서 playhead와 모든 note edge의 weight=0 및 weight 범위를 검사했다.
초기 쉼·5.5초·11.9초·16.8초·영상 마지막 프레임의 target/overlay SVG·PNG를 보존했다.
기존 파일 886개는 해시 일치한다. baseline.mp4는 원본 사본이다.
PNG는 기존 native Agg 변환이며 실제 브라우저 화면이 아니다. B5.2 A/B 영상은 아직 생성하지 않았다.
사용자 경계 확인은 대기다. 다음은 이 경계를 만족하는 한 종류의 폭 spring을 별도 A/B로 구현한다.
