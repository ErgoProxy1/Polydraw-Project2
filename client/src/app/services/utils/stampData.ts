import { Color } from './color';

// -------- Liste des etampes ---------//

// Note: centerX et centerY representent le point de rotation par rapport a l'origine du svg path
export class StampInfo {
  readonly name: string;
  readonly color: Color;
  readonly centerX: number;
  readonly centerY: number;
  readonly adjustedScale: number;
  readonly initRotation: number;
  readonly image: string;
}

export const DefaultStamps: StampInfo[] = [
 {
    name: 'Aucun', color: new Color(0, 0, 0, 0), adjustedScale: 0, initRotation: 0, centerX: 0, centerY: 0,
    image: 'None',
  },

  {
    name: 'Ancre', color: new Color(0, 0, 0, 1), adjustedScale: 0.2, initRotation: 0, centerX: 500, centerY: 500,
    image: 'M89,701.2c2.7,20.5,8.4,40.6,16.4,59.7c5.2,12.4,15.8,44.6,32.2,46.2c5.6,0.6,10.9-3.5,13.5-8.5c3.9-7.4,5.4-16.6,9-24.3\
    c3.9,4.2,7.2,9.5,10.5,14.3c9.3,13.4,18.2,27.1,27.9,40.2c17.6,23.7,40.2,41.8,66.3,55.1c25.8,13.2,52.3,25,78.6,37\
    c27.1,12.4,54.3,24.7,78.4,42.6c13.6,10.1,25.7,21.7,35.8,35.3c0.6,0.8,1.3,1.5,1.9,2.2c7.9-7.4,15.3-15,23.3-21.9\
    c24.8-21.6,53-38,82.7-51.9c27.6-12.9,55.7-24.7,83.6-37c0.7-0.3,1.5-0.5,3.6-1.2c0.8,5.7,2.3,11,2.1,16.2\
    c-0.9,21.6-8.6,40.9-22,57.8c-1.4,1.7-3.9,3-6.2,3.5c-22.6,5.4-34.1,35.1-20,52.4c1,1.3,3.5,2.6,4.8,2.2c9.6-2.7,19.4-5,28.5-9\
    c29.5-13.1,46.4-37,55.1-67.2c7.1-24.6,7.5-49.6,2.6-74.7c-1.2-5.9-0.8-10.4,3.7-15.3c12.7-13.9,24.9-28.2,36.9-42.7\
    c9.9-12,17.6-25.4,23.9-39.9c3.1,14.4,4.8,32.1,25.1,28.9c32.7-5.1,43-66.5,47-92.9c1.9-12.4,4.3-25.2,3.5-37.6\
    c-1.6-22.5-6.1-45.1-15.2-65.8c-4.1-9.3-28.3-56.5-40.4-47.7c-3.3,2.4-4.8,6.6-6.2,10.5c-19.9,57-55.7,101-94.4,146.3\
    c-3.8,4.5-7.8,9.4-8.4,15.2c-0.7,7.7,5,14.9,12.1,18.1c8.7,3.9,17.7,1.5,26.5,3.5c-3.9,6.2-8.5,12.3-13.3,17.7\
    c-10.9,12.2-25.1,20.2-38.9,28.5c-1,0.6-3,0.4-3.9-0.2c-15.5-9.9-32.8-13.6-50.9-14.3c-32.4-1.3-63.3,4.5-92.5,20.8\
    c-0.2-1.9-0.4-3.4-0.5-5c-0.9-94.2-1.6-188.3-2.9-282.5c-0.2-12.8,4.1-22.4,12.2-31.4c24.2-26.8,40.7-57.9,49.1-93.1\
    c2.5-10.6,3.6-21.6,5.5-33.1c8.1-0.8,16.5-1.6,24.9-2.6c23.3-2.7,46.6-5.4,69.9-8.3c2.9-0.4,4.1,0.6,5.5,2.9\
    c8.7,13.8,20.8,20.9,37.6,19.5c20.1-1.6,35.4-20.1,34-41.5c-1.3-18.4-11.5-31-29.4-34.1c-20-3.5-33.3,2-42.3,19.2\
    c-1.2,2.3-2.4,3.6-5.3,3.3c-30.1-2.4-60.1-4.8-90.2-6.9c-5.6-0.4-8.1-3.3-9.2-8.1c-1.8-7.6-3.3-15.3-5.2-22.9\
    c-0.5-1.9-1.1-4.1-2.4-5.4c-3.7-3.8-2.2-7.3,0.8-9.9c6.6-5.6,13.4-10.9,20.4-15.9c13.7-9.8,17.1-28.6,7.8-42.4\
    c-6.8-10.1-27.5-14.6-36,1.4c-6.6,12.4-7,12.2-19.6,18.2c4.3,3.7,7.2,7.9,5.1,14.4c-7.9-6.4-17-5-25.8-5c-9.5-0.1-18.3-1.7-25.2-8.8\
    c-1.3-1.3-2.6-2.6-3.5-4.2c-2-3.5-0.3-6.2,3.6-5.7c14.5,1.9,28.9,4.1,42.7,6.1c4-8,7.8-17.4,13-25.9c28.4-46.5,6.5-113.8-55.5-131.9\
    c-24.3-7.1-48.1-6.8-71.4,2.9c-30.5,12.7-47.9,36.1-53,68.6c-0.7,4.4-2.5,7-6.2,9.3c-13.1,8.3-25.7,17.2-35.6,29.5\
    c-16.4,20.4-19,51.1-6.4,74.4c13.7,25.5,35.8,40.2,62.5,48.7c8.9,2.8,18.3,4.3,28.7,6.7c-4.3,0.7-7.6,1.4-10.9,1.7\
    c-29.9,2.4-59.8,4.6-89.7,6.9c-17.8,1.4-35.6,2.6-53.3,4.1c-4.1,0.4-6.6-0.4-9-4.2c-18.6-29.6-55.1-21.2-68.6,1.7\
    c-11.5,19.4-2,43.8,20.3,52c18.1,6.7,36.2,0.8,46.7-15.4c1.7-2.6,3.3-3.4,6.5-3.1c29.9,3.6,59.9,7.3,89.9,10.4\
    c22,2.3,44.2,3.8,66.3,5.3c3.7,0.3,4.8,1.2,4.8,4.9c-0.1,53.2,0,106.3-0.2,159.5c0,2-1.1,4.6-2.5,6c-29.4,29.3-50.9,63.6-66.1,102\
    c-18.3,46.3-25.6,94-15.3,143.5c3.5,16.8,9.4,32.9,16.9,48.6c-47.6-11.8-109.4-31.5-135.4-77.3c9.3-1.7,19.5-1.6,28.1-6\
    c6.9-3.5,12.6-10.4,12.6-18.2c0-8.8-6.7-15.9-13.1-21.9c-20.3-18.8-47.3-37.5-60.9-62.2c-9.6-17.5-17-36.1-23.8-54.9\
    c-3.4-9.5-6.4-31.9-21.8-27c-15.3,4.9-19.2,22.9-25.1,35.6C90.2,631.2,83.9,662.5,89,701.2z M229.2,330.3c0,9.5-7.7,17.2-17.2,17.2\
    s-17.2-7.7-17.2-17.2c0-9.5,7.7-17.2,17.2-17.2S229.2,320.8,229.2,330.3z M693.8,330.3c0-9.5,7.7-17.2,17.2-17.2\
    c9.5,0,17.2,7.7,17.2,17.2c0,9.5-7.7,17.2-17.2,17.2C701.4,347.4,693.8,339.7,693.8,330.3z M693.8,893.8c-1.5-6-6.2-7.8-11-10\
    c-3.4-1.5-6.2-4.2-10-6.9c6-3.9,10.2-6.6,15.2-9.8C690.8,876.1,700.2,882.9,693.8,893.8z M693.1,922c-3-10.4-11.4-14.2-18.8-19.2\
    c-3.9-2.7-7.6-5.9-10.8-9.4c-1.6-1.8-2-4.7-3-7.1c2.7-1,5.5-2.6,8.2-2.8c2.9-0.2,6,0.6,8.7,1.8c8.1,3.6,13.9,9.7,17.1,17.9\
    C696.9,909.2,696.9,915.1,693.1,922z M687.6,951.7c-1.3-8.8-6-14.7-11.4-20.3c-4.8-5-9.8-10-13.9-15.6c-4.4-6-5.2-12.9-2.1-20.1\
    c5.3,4.9,10.5,9.3,15.3,14c4.4,4.3,9,8.5,12.8,13.3C695.1,931.5,694.8,942.7,687.6,951.7z M666.5,954.6c-3.4-7-6.3-14.2-8.7-21.6\
    c-1.4-4.4-0.2-9,3.4-14.5c4.7,6.3,9.2,11.3,12.6,17.1c5.4,9.3,9,19.3,7.3,30.4c-0.8,5.3-3.8,8.9-9.5,11\
    C673.3,968.3,669.8,961.5,666.5,954.6z M648.5,979.4c0.9,4.4,1,8.9,1.2,13.4c0.1,1.4-0.2,3.2-1,4.3c-7.5,10.3-16.3,18.9-29.8,20.8\
    c-6.1,0.9-8.4-0.2-11.2-5.7c-5.6-11.1-1.6-28.9,8.2-36.4c4.1-3.1,8.6-4.1,13.4-1.4c-2.1,11.8-4.1,23.4-6.3,35.4\
    c6.6-3.5,8.2-9.6,8.9-15.8c0.9-7.6,1.1-15.3,1.9-22.9c0.7-6.4,2.5-12.3,8.9-15.5C644.9,963.9,647,971.6,648.5,979.4z M666.8,973.2\
    c1.6,12.2-3.5,21.5-14.1,25.2c2.9-8.6,0.9-16.8-0.8-25.1c-1.4-7-2.4-14.1-2.9-21.1c-0.4-4.9,1.2-9.5,5.6-12.9\
    C660.6,949.2,665.4,963,666.8,973.2z M336.2,783.5c6.8,3.1,13.5,6.2,20.4,9.1c6.2,2.7,12.8,4.8,18.9,7.7c5.9,2.9,10.4,7.4,12.5,14.1\
    c-7.6,0.6-26.4-2.5-34.4-6.3c-4.7-2.2-9.4-5-13.4-8.3C334.8,795.3,333.7,788.3,336.2,783.5z M330.6,750.1\
    c5,10.2,14.5,14.3,23.5,19.4c5.3,3,10.5,6.4,15.1,10.4c4.3,3.7,6,8.9,4.7,15.4c-12.5-5.7-25.5-9.8-35.9-18.6\
    C329.1,769.2,326.6,759.5,330.6,750.1z M329.7,725c3.5,3.7,7,8.1,11.2,11.5c4.9,4,10.5,7,15.6,10.7c8.4,6.2,14.6,13.7,12.4,25.7\
    c-7-4.5-13.7-8.4-20-12.9c-5.1-3.6-10.2-7.5-14.6-12C327.7,741.2,326.4,730.9,329.7,725z M332.4,694.4c3.4,4.3,6.3,8.7,9.8,12.6\
    c6,6.6,12.8,12.7,18.6,19.5c5.8,6.8,8.3,14.9,5.8,23.5c-6.7-5.8-13.3-11.5-19.9-17.2c-4-3.5-8.5-6.5-11.9-10.5\
    c-6.6-7.7-4.6-17-3.9-26C330.9,695.6,331.9,695,332.4,694.4z M342.4,672c1.4,2.2,2.3,4.8,3.9,7c4.9,6.5,10.1,12.8,14.9,19.4\
    c5.9,8.1,9.1,17,5.5,27.1c-4.9-5.2-9.5-10.1-14.1-15c-4.5-4.9-9.5-9.5-13.1-14.9c-4.5-6.7-5-14.7-3.6-22.6c0.3-1.4,2-2.9,3.4-3.6\
    C339.7,669,341.6,670.8,342.4,672z M348.1,640.8c4.1,7.7,8,15.3,12.2,22.6c2.1,3.7,5.1,7,7.3,10.7c4.9,8.6,6.3,17.5,1.4,27.1\
    c-3.3-4.4-6.4-8.3-9.1-12.5c-5.2-7.7-10.7-15.3-15-23.4C340,656.4,342.1,647.8,348.1,640.8z M359.3,615.8c3.4,8,6.5,15.7,9.9,23.4\
    c2.2,4.8,5.2,9.3,7.4,14.1c3.6,8,3.2,15.8-2.5,24.1c-6.2-10.2-12.5-19.8-17.9-29.8c-2.2-4.1-3.3-9.1-3.9-13.8\
    C351.5,626.4,354.1,620,359.3,615.8z M372.5,591.2c2.8,8.3,5.4,16.5,8.3,24.7c2,5.6,4.9,10.9,6.6,16.6c2.1,7.2,0.4,13.9-4.9,20\
    c-7.7-11.9-15.1-23.3-18-36.9C362.3,605.1,365.7,595.7,372.5,591.2z M392.7,587.1c1.7,7.8,4.4,15.3,5.9,23.1\
    c1.7,8.6-0.2,16.4-7.5,23.2c-2.3-6.6-4.4-12.3-6.3-18.1c-3.3-10.1-6.9-20.1-5.9-31.1c0.8-7.9,4.4-13.9,10.2-18\
    C390.3,573.2,391.2,580.2,392.7,587.1z M404.6,608.4c-5.1-9.4-7.2-19.3-8.7-29.5c-1.2-7.8-1.2-15.6,2.2-23c2.4-5.3,6.2-7.7,10.6-7.3\
    c0.5,6.7,0.7,13.2,1.4,19.8c0.8,8.1,2.4,16.1,2.7,24.2C413,598.8,411.3,604.8,404.6,608.4z M415.7,608.6\
    c-0.9,75-1.7,148.6-2.5,223.2c-3.1-1.9-4.8-2.9-6.4-4c-2-1.4-4.1-2.9-5.9-4.6c-16.6-15-23.9-34.8-26.8-56\
    c-6.3-45.8,0.4-89.9,20.7-131.7C399.6,625.6,405.7,616.6,415.7,608.6z M391.1,298c0.4-4.7,1.2-6.2,5.5-7.8c7.6-2.8,13.2-8,18.2-14.2\
    c3.1-3.9,6.5-7.6,10.4-10.7c6.1-4.9,13.3-4.7,19.8-0.1c-1.4,1-2.9,1.8-4,3c-6.1,6.7-12.2,13.6-18.2,20.4\
    C414.2,298.1,403.5,300.3,391.1,298z M471.5,161.1c9-1.1,17,3,19.9,9.6c-6.1,1.7-12.4,3.4-18.5,5.2c-6.5,2-12.9,4.5-19.5,6.2\
    c-6.6,1.7-12.7,0-18.6-5c2.9-1.8,5.2-3.3,7.6-4.7C451.5,167.3,460.8,162.4,471.5,161.1z M442.9,168.6c-2.2,1.5-4.6,2.8-7.1,3.5\
    c-3,0.8-6.3,0.9-9.4,1.3c0.1-3.7,0-7.5,0.4-11.2c0.1-1.3,1.4-2.6,2.3-3.7c7.5-8.3,17.1-11,28-10.1c5,0.4,9.3,2,13.1,6.6\
    C459,156.2,451.2,162.9,442.9,168.6z M467.1,264.7c-4.1,5.3-7.7,10.2-11.5,15.1c-3.8,4.8-7.3,10-11.6,14.2\
    c-6.9,6.7-15.2,8.5-23.9,4.7c5.1-5.9,10-11.6,15-17.3c4-4.6,7.7-9.6,12.2-13.7C453.1,262.3,460,262.6,467.1,264.7z M336.9,265.2\
    c12.1,1.7,23-2.3,34-6c8.9-3,18.1-4.5,28.3,0.5c-5.1,3.2-9.3,6.6-14.1,8.7c-8.2,3.5-16.5,7.1-25.1,8.9\
    C350,279.4,340.2,273.6,336.9,265.2z M321,238.7c0.5-0.2,0.9-0.3,1.4-0.5c4.2,5.1,10,6.5,16.1,6.7c8.6,0.4,17.3,0.4,26,0.8\
    c5.3,0.3,10.5,1,15.2,5.3c-16.5,7.3-29.4,10-42.8,8.9c-1.5-0.1-3.6-0.5-4.4-1.6c-3.3-3.9-6.5-8-9.2-12.4\
    C321.8,243.8,321.7,241.1,321,238.7z M319.8,205.5c2.3,7.5,7.7,11.9,14,15.2c4.9,2.5,10,4.5,14.9,6.9c5.7,2.8,11.1,6,14.4,12.4\
    c-10.9,2.7-23.6,1.4-32.6-3C317.1,230.3,313.7,215.6,319.8,205.5z M333.2,172.9c-1.7,13.8,4.2,24.6,12.9,34.5\
    c4.7,5.4,8.4,11.7,12.6,17.6c-0.5,0.4-0.9,0.8-1.4,1.2c-15.7-0.9-31.3-14.5-34.1-29.7C321.5,187.2,326,176.2,333.2,172.9z\
    M356.6,212.1c-1,0.2-2,0.4-3,0.6c-3.3-5.6-7.3-11-9.8-17c-4.2-10.3-6-21.1-1.7-32c2.5-6.4,8.5-9.6,15.4-8.1\
    c-6.5,6.5-5.4,14.4-4.2,22.2c1.1,7,3.4,13.9,4.3,21C358.1,203.1,356.9,207.6,356.6,212.1z M360.4,199.1c-0.8-11.1-1.8-21.2-2.3-31.2\
    c-0.2-4.4,1.1-8.7,6.2-13.1c1.5,11.2,3.1,21.1,3.9,31.1C368.6,191,366.2,195.5,360.4,199.1z M413,256.4c-18.5,2-43.3-12.8-50.7-29.7\
    c-5.6-12.9-0.9-25.8,12-32.5c0.4,0.7,0.8,1.1,1,1.5c7.6,16.6,18.4,30.4,35.5,38.2c0.9,0.4,2,1.6,2,2.4\
    C413.1,243,413,249.8,413,256.4z M418.8,265.4c-6.8,6-12.6,12-19.3,16.7c-5.2,3.6-11.3,6.4-17.4,8.1c-7,1.9-14.5-2.3-17.5-8.5\
    c7.9,1.3,14.1-2,19.8-6.7c3.6-2.9,7.2-5.9,11.1-8.5C402.5,261.8,409.9,261.5,418.8,265.4z M442.7,142.8\
    c-7.5,5.9-14.4,11.4-21.3,16.9c-0.5-0.1-0.9-0.3-1.4-0.4c1.5-5.8,2.9-11.6,4.5-17.8C430.6,142.8,437,138.4,442.7,142.8z\
    M497.7,168.7c-20.4-17.5-42.3-31.9-70.8-32.6c2.6-9.2,9.2-16.4,17.1-19.3c18.5-6.8,41.9,0.3,53.6,16.2\
    C505.5,143.8,505.7,157.5,497.7,168.7z M513.4,191.4c-8.4,0.7-16.5,1.4-24.7,2.2c-6.4,0.6-12.9,2-19.3,2c-6.7,0.1-12.1-3-15.4-10.8\
    c12.8-2.3,24.9-5.2,37.2-6.4C501.5,177.3,509.2,182.8,513.4,191.4z M481.7,210.3c-6-1.3-11.1-4.3-14.1-11.8\
    c10.3-0.5,19.7-1.6,29.1-1.3c7.4,0.3,14.8,1.8,21.9,3.9c7,2,10.1,7.8,9.1,13.3c-9.8-0.7-19.6-1.3-29.3-2.1\
    C492.8,211.9,487.2,211.5,481.7,210.3z M489.7,257c-5.1,12.8-8.7,25.5-17.6,35.6c-6.7,7.6-15.7,9.5-24.7,5.8\
    c6.7-9.1,13.3-17.9,20-26.8C472.9,264.3,479.1,258.2,489.7,257z M503.3,253.1c5.4,14.5,2.6,26.2-6.2,36.3\
    c-6.5,7.5-14.8,11.6-26.7,8.7c8.6-4.5,12-11.3,15.2-18.3c2.6-5.9,5.1-12,8.4-17.5C496.2,259,499.8,256.6,503.3,253.1z M553,263.2\
    c-7.8-2.4-15.5-4.7-23.2-7.1c-6.2-1.8-12.7-3-18.5-5.6c-3.7-1.7-6.8-5.1-9.5-8.4c-1.4-1.7-1.2-4.6-1.7-7.1c7.3,1.2,15.5,1.8,23.3,4\
    c8.4,2.4,16.7,5.5,24.3,9.6C553.6,251.8,554.9,258.4,553,263.2z M561,262.2c-2.9-7.5-6-14.6-8.3-22c-3.9-12.4,0-23.4,7.4-33.2\
    c5.5-7.3,13.7-7.9,21.2-2.2c6.6,5,10.8,11.7,12.1,20c1.9,12.3-5.3,21.9-18.9,23.6c-1.6-12.2-3.2-24.4-4.9-37.5\
    c-3.5,5.7-3.3,10.9-2.8,16.2c0.7,7.4,1.9,14.9,2.2,22.3C569.2,254.6,567.2,259.3,561,262.2z M563.9,292.2\
    c-5.8-7.7-13.8-9.2-21.3-11.6c-5.9-1.8-11.8-3.5-17.4-5.9c-7.3-3.2-11.8-8.9-13.2-17.9c4,0.8,7.2,1.3,10.4,2.1\
    c12.9,3.2,26,6.3,36.1,15.9C563,279.1,565.4,284.5,563.9,292.2z M522.7,293.3c0,4.2,0,8.4,0,12.9c-4.6,0-8.9,0-13.1,0\
    C508,296.5,513.9,290.9,522.7,293.3z M569.7,318.8c-2.8-2.3-5.1-4.8-7.8-6.5c-9.6-5.7-19.4-11-29.1-16.6c-3.2-1.8-6.3-3.7-9.1-6\
    c-2.6-2.2-2.8-5-0.9-8c1.9-3.2,4.1-2.5,6.8-1.3c4.4,2,9.1,3.3,13.3,5.8c7.6,4.4,15.3,8.8,22,14.3C570,304.8,571.9,311.4,569.7,318.8\
    z M569.5,344c-6.6-9.6-17.1-13.6-26.1-19.7c-3.5-2.4-7-5.1-9.8-8.4c-3.6-4.2-4.6-9.2-2.5-14.8c3.4,2,6.3,3.7,9.2,5.3\
    c3.1,1.6,6.3,3,9.3,4.7c5.1,3,10.5,5.8,15.1,9.5C572.1,326.7,573.7,335.2,569.5,344z M563.1,363.3c-0.6-1.7-1.7-4-3-4.4\
    c-10.8-3.1-17.9-10.5-23.6-19.6c-2.9-4.7-4.8-9.7-3-15.6c9,6.2,17.9,11.9,26.3,18.2c9.9,7.4,13.9,17.4,12.1,30.1\
    C565.9,371.6,564.6,367.4,563.1,363.3z M562.4,400.4c-3.9-5.8-7.6-11.7-11.6-17.3c-4.6-6.3-10-12-14.2-18.5\
    c-3.5-5.5-2.8-14-1.2-16.4c7.6,6.6,16.1,13.1,23.6,20.7C569.1,379.2,569.8,391.8,562.4,400.4z M550.4,429.6\
    c-0.4-10.1-4.4-17.3-9-24.3c-3.1-4.7-6.1-9.5-8.5-14.6c-3.6-7.5-3-15.1,0.6-23.3c5.7,8,11,15.4,16.2,22.8c1.4,2,3.1,4.1,3.9,6.4\
    c1.8,5.6,3.9,11.3,4.3,17.1C558.3,419.4,555.5,424.5,550.4,429.6z M540.1,451c-3.7-8.4-7.4-16.6-11-24.8c-2-4.7-4.2-9.5-5.5-14.4\
    c-2.1-7.9-0.6-15.3,4.3-22.2c3.2,6.3,6.3,12.1,9.1,18.1c3.4,7.2,7.2,14.3,9.5,21.8C548.9,437.8,546,445.2,540.1,451z M518.5,453.9\
    c-1.9-7-4.5-13.9-6-21c-1.7-8.2,0.3-15.6,7.3-21.7c1.6,4.8,3,9,4.4,13.2c2.9,8.8,6.3,17.5,8.4,26.5c2.3,9.8-0.7,18.3-8.7,24.9\
    C522,468.3,520.4,461,518.5,453.9z M514.1,453.5c2.2,12.1,7.3,24.3-1.4,35.7C513.3,477.3,508.7,465.2,514.1,453.5z M509,379.3\
    c0-15.8,0.4-16.2,16.3-15.4c0.8,0,1.6,0.2,2.4,0.4c-2.9,16.7-9,45.1-18.3,47.8c-0.1-0.3-0.4-0.6-0.4-0.9\
    C509,400.5,509,389.9,509,379.3z M506.8,294c-1.6,0.6-3.7,0.1-4.6,0.1c1.8-5.5,3.4-10,4.8-14.6c1.2-3.7,1.6-7.9,6.2-8.7\
    c1.5,5,3,9.3,3.9,13.8c0.3,1.5-0.1,4.2-1.1,4.9C513.2,291.5,510,292.9,506.8,294z M614.9,814.9c9.6-5.4,16.4-18.1,30.3-11.3\
    C634.9,807.1,626.6,815.8,614.9,814.9z M583.7,823.2c6.9-8.5,13-16.8,19.8-24.4c9.1-10.2,24.3-11.9,34-3.9\
    c-8.8,1.2-14.2,7.2-20.1,12.4c-4.7,4.2-9.3,8.6-14.3,12.3C597.7,823.6,591.4,825.3,583.7,823.2z M563.7,826.6\
    c2.8-6.3,5.9-12.1,7.9-18.3c5.7-17.5,18.3-25.7,37.3-22.8c-1.4,1.8-2.3,3.4-3.7,4.6c-2.6,2.3-6,4-8,6.7c-5.3,7-9.7,14.7-15,21.7\
    C577.5,824.8,571.1,828.2,563.7,826.6z M539.7,836.4c1.4-3.6,2.8-6.9,4-10.4c1.2-3.4,2.1-7,3.5-10.4c2.7-6.2,5.2-12.6,8.7-18.4\
    c4.6-7.8,11.8-9.9,20.2-7.3c-5.3,10.2-10.2,20.3-15.7,30.1c-2.7,4.9-6.2,9.4-10,13.5C547.9,836.3,544.3,837.9,539.7,836.4z\
    M520.2,847.6c0.4-2,0.5-3.7,0.9-5.3c2.8-11.6,5-23.3,8.8-34.6c2.9-8.7,10-13.6,19.5-14.5c-3.8,12.3-7.3,24.3-11.3,36.2\
    c-1.5,4.5-3.9,8.8-6.5,12.8C529.3,845.9,525.8,848.5,520.2,847.6z M498.9,861.3c1.4-8,2.7-16,4.4-23.9c1.7-8.1,3.2-16.3,6-24\
    c2.4-6.8,8-10.8,15.6-12c-2.5,13.3-4.6,26.1-7.4,38.7c-1.3,5.6-3.5,11.1-6.2,16.1C508.3,861.4,503.9,862.7,498.9,861.3z\
    M474.7,877.9c2.3-11.2,4.3-22,6.9-32.8c1.4-5.9,3.4-11.8,5.9-17.4c2.4-5.2,6.9-8.5,14.5-10.2c-3,15.3-5.1,29.6-8.7,43.5\
    C491,870.2,484.1,876.1,474.7,877.9z M441.1,880.7c10.5-4.9,13.8-14.5,17.7-23.9c2.5-5.8,4.9-11.7,8.4-16.9c2.4-3.6,6.6-6,9.9-8.9\
    c0.5,0.4,1,0.7,1.5,1.1c-0.2,3.2-0.3,6.5-0.7,9.7c-1.5,11.3-3.5,22.4-10.1,32.1C461.7,883.1,451.7,885.7,441.1,880.7z M405.5,875.4\
    c1.4-0.5,2.6-0.8,3.8-1.2c13.8-4.4,26.9-9.9,33.6-24.3c0.6-1.3,1.7-2.4,2.7-3.5c4.3-4.4,8.3-4.7,13.9-0.7\
    c-5.1,12.6-11.7,24.2-23.3,32.1C426.9,884,414,883.1,405.5,875.4z M377,858.8c10.9,1.2,19.8-1.3,28.3-5.3c3.9-1.8,7.8-3.8,11.9-5.2\
    c7.4-2.7,15-4.1,23.9,0.3c-5.4,4.5-9.9,8.9-15.1,12.3c-10.4,6.8-21.8,10.8-34.5,7.8C385.8,867.4,381.4,864.2,377,858.8z\
    M358.1,837.5c8.8,0,16.9,0.2,25-0.1c7-0.3,13.9-1.6,20.8-1.7c6.2-0.1,12.1,1.4,17.6,7.4c-8.9,2.9-17,5.8-25.3,8\
    c-7.9,2.2-16.1,2.9-24.1,0.4C365.1,849.4,360.3,844.9,358.1,837.5z M343.9,811.3c8.3,1.9,16.2,3.7,24.3,5.5c7.4,1.6,15,2.8,22.4,4.7\
    c4.9,1.3,8.9,4.3,11.2,10.1c-3.2,0.7-5.9,1.4-8.7,1.8c-13.9,1.7-27.6,1.2-40-6.4C347,823.2,343.6,817.9,343.9,811.3z'},

  {
    name: 'Avion', color: new Color(0, 0, 0, 1), adjustedScale: 0.5, initRotation: 0, centerX: 100, centerY: 110,
    image: 'M195.732,99.447c-0.619-3.613-3.726-6.235-7.387-6.235c-0.423,0-0.851,0.036-1.271,0.108l-57.527,9.849\
    c-4.661-13.083-16.063-23.985-25.472-27.167c0.321-2.469,0.512-5.092,0.512-7.706c0-10.744-3.054-21.25-5.333-21.25\
    c-2.351,0-5.333,10.005-5.333,21.25c0,2.59,0.179,5.164,0.48,7.582c-9.282,3.078-21.234,14.491-26.072,27.639L8.766,93.32\
    c-0.42-0.072-0.848-0.108-1.271-0.108c-3.661,0-6.768,2.622-7.387,6.235c-0.697,4.075,2.051,7.959,6.127,8.658l20.185,3.456v5.594\
    c-2.468,1.019-4.211,3.449-4.211,6.282c0,3.747,3.048,6.795,6.795,6.795s6.795-3.048,6.795-6.795c0-2.895-1.823-5.366-4.378-6.343\
    v-4.677l16,2.739v2.999c-2.468,1.019-4.211,3.449-4.211,6.282c0,3.747,3.048,6.795,6.795,6.795s6.795-3.048,6.795-6.795\
    c0-2.895-1.823-5.366-4.378-6.343v-2.081l13.873,2.375c1.501,17.811,14.756,30.406,32.627,30.406\
    c17.985,0,31.292-12.759,32.65-30.752l11.85-2.029v2.081c-2.555,0.977-4.378,3.448-4.378,6.343c0,3.747,3.048,6.795,6.795,6.795\
    s6.795-3.048,6.795-6.795c0-2.832-1.743-5.263-4.211-6.282v-2.999l16-2.739v4.677c-2.555,0.977-4.378,3.448-4.378,6.343\
    c0,3.747,3.048,6.795,6.795,6.795s6.795-3.048,6.795-6.795c0-2.832-1.743-5.263-4.211-6.282v-5.594l20.185-3.456\
    C193.681,107.406,196.429,103.522,195.732,99.447z M110.92,117.92h-25c-3.038,0-5.5-2.462-5.5-5.5s2.462-5.5,5.5-5.5h25\
    c3.038,0,5.5,2.462,5.5,5.5S113.958,117.92,110.92,117.92z'},

  {
    name: 'Clé', color: new Color(192, 167, 92, 1), adjustedScale: 0.1, initRotation: 0, centerX: 448, centerY: 432,
    image: 'M640.9 63.89999999999998c-141.4 0-256 114.6-256 256 0 19.6 2.2 38.6 6.4 56.9L0\
    768v64l64 64h128l64-64v-64h64v-64h64v-64h128l70.8-70.8c18.7 4.3 38.1 6.6 58.1 6.6 141.4\
    0 256-114.6 256-256S782.2 63.89999999999998 640.9 63.89999999999998zM384 512L64\
    832v-64l320-320V512zM704 320c-35.3 0-64-28.7-64-64 0-35.3 28.7-64 64-64s64 28.7\
    64 64C768 291.29999999999995 739.3 320 704 320z'},

  {
    name: 'Coeur', color: new Color(232, 76, 61, 1), adjustedScale: 0.4, initRotation: 135, centerX: 150, centerY: 150,
    image: 'M0 200 v-200 h200 a100,100 90 0,1 0,200 a100,100 90 0,1 -200,0 z',
  },

  {
    name: 'Crayon', color: new Color(0, 0, 0, 1), adjustedScale: 0.01, initRotation: 270, centerX: 4885, centerY: 490,
    image: 'M8215.9,4442.7l-1676.6-560.5L3396.9,747.2C467.8-2171.9,249.5-2397.7,180-2546.5c-99.2-208.3-106.6-463.8-19.8-689.5\
    c52.1-136.4,109.1-203.4,677.1-773.8c731.7-739.1,771.3-763.9,1145.9-763.9c404.3,0,104.2-267.9,3655.8,3276.3\
    l3152.3,3144.9l558,1674.1c305.1,920.1,555.6,1676.6,550.6,1676.6C9897.4,5000.8,9141,4752.7,8215.9,4442.7z \
    M8627.6,3691.2c-111.6-372-439-1334.3-451.4-1334.3c-24.8,0-935,915.2-922.6,925.1c14.9,12.4,1341.8,458.8,1371.5,461.3\
    C8637.5,3745.8,8637.5,3721,8627.6,3691.2z M7154.4,2245.3l558-560.5L5542.2-470.5L3372.1-2623.3l-558,555.6l-558,555.5\
    L4413.7,645.5c1185.5,1188,2162.7,2157.8,2170.2,2157.8C6591.3,2803.3,6846.8,2552.8,7154.4,2245.3z M2313-2690.3l501-496\
    l-401.8-401.8c-223.2-223.2-421.6-404.3-441.5-404.3c-39.7,0-1091.3,1039.2-1091.3,1078.9c0,12.4,181,205.8,401.8,426.6\
    l401.8,401.8l64.5-54.6C1782.3-2169.5,2035.2-2417.5,2313-2690.3z'},

  {
    name: 'Loupe', color: new Color(69, 63, 63, 1), adjustedScale: 0.01, initRotation: 270, centerX: 4990, centerY: 490,
    image: 'M2906.9,4986.5c-728.2-131.8-1320.2-437.8-1831.8-951.6c-480.3-478.1-788.6-1045.5-931.5-1720.1\
    c-58.1-270.3-58.1-1025.4,0-1295.7C398.2-176.1,1249.3-1141.1,2379.7-1514.2c377.5-125.1,592-156.4,1063.3-156.4\
    c366.4,0,471.4,6.7,663.5,49.2c402.1,87.1,815.4,254.7,1121.4,451.3l129.6,84.9l440.1-440.1l437.8-437.8v-149.7\
    c0-167.5,55.8-370.8,140.7-513.8c31.3-53.6,491.5-529.4,1025.4-1058.9c893.6-889.1,978.5-967.3,1112.5-1025.4\
    c174.2-76,469.1-102.8,643.4-55.8c348.5,96.1,623.3,370.8,719.3,719.3c46.9,174.2,20.1,469.1-55.8,643.4\
    c-58.1,134-136.3,218.9-1025.4,1112.5c-529.4,533.9-1005.3,994.1-1058.9,1025.4c-143,84.9-346.2,140.7-513.8,140.7\
    h-149.7l-437.8,437.8l-440.1,440.1l84.9,129.6c196.6,306.1,364.1,719.3,451.3,1121.4c71.5,328.4,71.5,996.3,0,1324.7\
    c-292.7,1347.1-1275.6,2336.7-2618.2,2633.8C3885.4,5013.3,3139.3,5026.7,2906.9,4986.5z M4035,4001.4\
    C5127.5,3688.6,5833.4,2716.9,5782,1599.9C5723.9,362.3,4747.7-613.9,3510.1-672c-949.4-42.5-1814,469.1-2236.1,1322.5\
    c-198.8,406.6-272.5,797.5-239,1275.6c60.3,819.9,600.9,1588.3,1364.9,1941.3C2898,4097.4,3519,4148.8,4035,4001.4z'},

  {
    name: 'Nuage', color: new Color(0, 0, 0, 1), adjustedScale: 0.3, initRotation: 0, centerX: 256, centerY: 256,
    image: 'M320,96c53.031,0,96,42.969,96,96c0,12.625-2.594,24.625-7.031,35.688C449.813,238.75,480,275.688,480,320\
    c0,53.031-42.969,96-96,96H112c-44.188,0-80-35.813-80-80s35.813-80,80-80c2.453,0,4.75,0.5,7.141,0.719\
    c-4.5-10-7.141-21.031-7.141-32.719c0-44.188,35.813-80,80-80c14.438,0,27.797,4.125,39.484,10.813\
    C246.016,120.25,280.156,96,320,96 M320,64c-40.938,0-78.531,19.344-102.344,51.063C209.266,113.031,200.703,112,192,112\
    c-61.75,0-112,50.25-112,112c0,1.563,0.031,3.094,0.094,4.625C33.828,242.375,0,285.313,0,336c0,61.75,50.25,112,112,112h272\
    c70.594,0,128-57.406,128-128c0-46.656-25.656-88.813-65.156-111.125C447.625,203.313,448,197.656,448,192\
    C448,121.438,390.594,64,320,64L320,64z',
  },
];

/* Sources de images
 * Ancre: https://shopcraftables.com/products/anchor-with-rope-free-svg-cut-file/?utm_medium=Social&utm_source=Pinterest
 * Avio: https://www.svgrepo.com/svg/172233/airplane-front-view
 * Cle: https://upload.wikimedia.org/wikipedia/commons/4/48/Octicons-key.svg
 * Coeur: https://upload.wikimedia.org/wikipedia/commons/8/86/A_perfect_SVG_heart.svg
 * Crayon: https://www.onlinewebfonts.com/icon/524743
 * Loupe: https://www.onlinewebfonts.com/icon/548890
 * Nuage: http://simpleicon.com/wp-content/uploads/cloud-2.svg
 */