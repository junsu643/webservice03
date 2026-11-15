
구동
node server.js


실행테스트 A1 - A11
POSTMAN기준으로 작성했습니다
모두 GET으로 실행

A01	
http://localhost:3000/api/posts?page=0
http://localhost:3000/api/posts?page=-1
http://localhost:3000/api/posts?page=abc

A02
http://localhost:3000/api/posts?limit=1000

A03
http://localhost:3000/api/posts?page=9999

A04
http://localhost:3000/api/posts?sort=__proto__
http://localhost:3000/api/posts?sort=constructor
http://localhost:3000/api/posts?sort=toString

A05	
http://localhost:3000/api/posts?sort=views; DROP TABLE--
http://localhost:3000/api/posts?sort=views&sort=oldest

A06
http://localhost:3000/api/posts?sort=views&limit=100

A07
http://localhost:3000/api/posts?search=없는검색어

A08	
http://localhost:3000/api/posts/cursor

A09	
http://localhost:3000/api/posts/cursor?cursor=5

A10	
http://localhost:3000/api/posts/cursor?cursor=abc

A11	
http://localhost:3000/api/posts/cursor?search=커서&limit=10


브라우저 테스트
ID	입력/조작

B01	
검색창에 커서를 빠르게 입력 후 1초 대기

B02	
Network를 Slow 4G로 변경 → 검색창에 a 입력, 0.3초 이상 쉬고 ab 입력

B03	
오프셋 모드에서 5페이지로 이동 → 검색어 또는 정렬 변경

B04	
커서 기반 페이징 탭 선택 → 다음 10개 더 불러오기 3회 클릭 → 검색어 변경

B05	
커서 기반 페이징 탭에서 검색창에 Redis 입력 → 다음 10개 더 불러오기를 끝까지 클릭

B06	
커서 기반 페이징 탭 선택

B07	
검색창 커서, 정렬 조회수순, 3페이지로 맞춘 뒤 F5

B08	
검색·정렬·페이지를 몇 번 변경 → 브라우저 뒤로 가기 클릭
