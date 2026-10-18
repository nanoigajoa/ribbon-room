# B1.1 — 기존 네 파트 악보 대조

자동 검사: passed. 사용자 검토: 대기.

원본 XML을 production parser와 독립적으로 읽어 저장된 168개 이벤트의 pitch, beat/second, 길이, 원본 좌표, crop 경계, dynamics/velocity 결측을 대조했다.
기보 템포 quarter=152 BPM, 초 단위 구간 [0,15). 기존 score JSON과 debug 그림은 변경하지 않았다.

| 파트 | 음표 | 진입(초) | 붙임줄 병합 | 중음 진입 |
|---|---:|---:|---:|---:|
| Violin I | 60 | 1.578947 | 1 | 0 |
| Violin II | 46 | 1.578947 | 0 | 1 |
| Viola | 44 | 0.789474 | 0 | 1 |
| Cello | 18 | 0.000000 | 0 | 1 |

## 검토할 항목

- 두 바이올린은 1.579초, 비올라는 0.789초, 첼로는 0초에 진입한다.
- 붙임줄의 원래 경계는 흰 눈금, 병합 음표는 끊기지 않는 색 선으로 비교한다.
- 화음 pitch를 별도 선으로 유지하며 쉼표는 빗금 구간으로 표시한다.
- velocity는 전부 null, dynamics는 p/fp/sf/ff이다. hairpin·강세를 실제 음량으로 추정하지 않는다.

## 한계

현재 고정 템포·단일 성부·비이조 MusicXML fixture만 대조한다. 범용 MusicXML 검증기나 실제 녹음 alignment 평가는 아니다.
새 스키마·MIDI beat·crop 전 고정 ID는 B1.2/B1.3에 남긴다. 시각·청취 품질은 사용자 검토 대기다.

공식 의미 확인: [chord](https://www.w3.org/2021/06/musicxml40/musicxml-reference/elements/chord/), [tie](https://www.w3.org/2021/06/musicxml40/musicxml-reference/elements/tie/).
