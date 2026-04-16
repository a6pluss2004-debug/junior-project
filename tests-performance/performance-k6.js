import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 5,
  duration: '10s',
};

export default function () {
  // اختبار الصفحة الرئيسية لضمان الحصول على Status 200
  const res = http.get('http://localhost:3000/');
  
  check(res, {
    'Success (Status 200)': (r) => r.status === 200,
    'Fast Response (< 200ms)': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
