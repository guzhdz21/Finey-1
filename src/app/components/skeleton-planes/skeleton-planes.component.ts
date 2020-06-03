import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-planes',
  templateUrl: './skeleton-planes.component.html',
  styleUrls: ['./skeleton-planes.component.scss'],
})
export class SkeletonPlanesComponent implements OnInit {

  rubros: number [] = [1,2,3,4,5,6,7];
  constructor() { }

  ngOnInit() {}

}
