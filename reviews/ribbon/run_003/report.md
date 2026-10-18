# B2.1 — 기본 리본 타이밍·발음 검토

멘델스존 Op.80 첫 15초. B1.3 0.3.0 전체 JSON을 사용하며 기존 악보 JSON과
168개 음표의 모든 기존 필드가 일치한다. 독립 XML 대조 통과. 기존 합성 기준음 WAV를 재사용한다.
실제 녹음 정렬은 이번 검토 범위가 아니다. 악보 CC0-1.0, SoundFont MIT 라이선스와 입력 해시는 provenance.json 참조.

브라우저·Remotion에서 공유하는 RibbonScene의 실제 SVG를 638개 시점에서 검사했다.
30fps의 전체 프레임과 각 음표 시작·끝 및 ±0.1 마이크로초를 포함한다.
고정 playhead x=650, 125px/s 우→좌 이동, 모든 가닥의 시작·끝·pitch, 모든 발음 ID를 확인했다.
중음은 모든 pitch를 보존하고 주 윤곽만 최고음을 선택한다. 쉼은 별도 contour로 끊는다.
곡선은 최대 ±35ms 시각 보간이며 발음·밝은 가닥·점은 원래 [시작, 끝) 경계를 따른다.
파트별 세로 음역 정규화를 유지한다. 오케스트라·Viola 강조 디자인을 추가하지 않았다.

실제 페이지가 쓰는 audio/seek controller를 미디어·DOM stub으로 검사했다.
재생 시 audio.currentTime을 직접 읽어 누적 timer drift를 피한다.
이동·±1/30초·0.5/0.75/1배속·일시정지·처음·끝·오류·cleanup을 확인했다.
이 검사는 브라우저의 실제 오디오 출력·렌더링 검사를 대신하지 않는다.

대표 SVG 6개와 해당 SVG의 가닥·곡선·발음 좌표를 Matplotlib로 그린 ribbon.png를 생성했다.
PNG는 진단 그림이며 브라우저 캡처가 아니다. 이전 기준 MP4는 baseline.mp4로 복사했다.
기존 입력·결과 303개 파일의 해시가 모두 유지된다. Chrome 재시도·공개 배포는 하지 않았다.
사용자 시각·청취 검토 대기. 다음 B2.2는 검토 후 요청에 따라 진행한다.

공식 API 참고: [React static markup](https://react.dev/reference/react-dom/server/renderToStaticMarkup),
[esbuild bundle](https://esbuild.github.io/api/#bundle),
[Remotion frame](https://www.remotion.dev/docs/use-current-frame),
[HTMLMediaElement currentTime](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime).
