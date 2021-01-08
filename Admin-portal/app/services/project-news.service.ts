import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Users} from '../users';

@Injectable({
  providedIn: 'root'
})
export class ProjectNewsService {
  constructor(private http: HttpClient) { }

  onCreatePost(formData: FormData) {
    return this.http.post('http://104.154.104.32:3000', formData);
   }
  fetchPost(user) {
    return this.http.get('http://104.154.104.32:3000/news/' + user);
  }

  getId(recievedRow) {
    return this.http.get('http://104.154.104.32:3000/news/' + recievedRow)
    .pipe(map(res => {
      return res;
    }));
  }

  onUpdate( Id, formData1: FormData) {
    return this.http.patch('http://104.154.104.32:3000/' + Id, formData1);
  }
  onDelete(news) {
  return this.http.delete('http://104.154.104.32:3000/' + news);
  }
   getCategory() {
        return this.http.get('http://104.154.104.32:3000/category');
  }
  getCategoryName() {
    return this.http.get('http://104.154.104.32:3000/category/category_name');
}

  getImage(image) {
  return  this.http.get('http://104.154.104.32:3000/' + image , { responseType: 'blob' });
  }
  getCountry(){
    return this.http.get('http://104.154.104.32:3000/tinnyBuzz/country');
  }
  getLanguage(){
    return this.http.get('http://104.154.104.32:3000/tinnyBuzz/language');
  }
  getLanguageName(name) {
    return this.http.get('http://104.154.104.32:3000/tinnyBuzz/language/' + name);
  }
  getPendingNews(){
    return this.http.get('http://104.154.104.32:3000/news/pending');
  }
  approveNews(Id){
    return this.http.patch('http://104.154.104.32:3000/approve/' + Id, {});
  }
  getStats(){
    return this.http.get('http://104.154.104.32:3000/tinnyBuzz/stats');
}
getApproved(){
  return this.http.get('http://104.154.104.32:3000/news/approved');
}
getTodaysNews(){
  return this.http.get('http://104.154.104.32:3000/tinnyBuzz/stats/24hr');
}
getNewsbyDate(date){
  return this.http.get('http://104.154.104.32:3000/tinnyBuzz/stats/perday?date=' + date );
}
getOldDateData(oldDate){
  return this.http.get('http://104.154.104.32:3000/tinnyBuzz/stats/count?date=' + oldDate);
}
getAllStats(currentDate){
  return this.http.get('http://104.154.104.32:3000/tinnyBuzz/stats/count?date=' + currentDate);
}
creatorForm(formData: FormData){
return this.http.post('http://104.154.104.32:3000/tinnyBuzz/creator', formData);
}
getCreatorForm(){
  return this.http.get('http://104.154.104.32:3000/tinnyBuzz/creator');
}
updateRow(id, formData: FormData){
  return this.http.patch('http://104.154.104.32:3000/tinnyBuzz/creator/' + id, formData);
}
deleteRow(id){
  return this.http.delete('http://104.154.104.32:3000/tinnyBuzz/creator/' + id);
}
resetPass(email , postData: {password: string}){
  return this.http.patch('http://104.154.104.32:3000/tinnyBuzz/creator/change/Password?email=' + email , postData);
}
}