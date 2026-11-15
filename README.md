
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

