import { environment } from './../environments/environment';

export class Constants {
  public static root = environment.root;
  public static webRoot = environment.webRoot;
  public static apiRoot = environment.root + 'api/';
  public static oktaDomain = 'https://dev-606257.oktapreview.com/';
  public static CALLBACK_PATH = 'implicit/callback';
  public static redirectUri = environment.webRoot + Constants.CALLBACK_PATH;
  public static issuer = 'https://vertican.net/oauth2/ausofuulttAUFDA6M0h7';
  public static clientId = '0oar282qb310Qz7TT0h7';
  public static dashBoardUrl = environment.dashBoardUrl;
}
